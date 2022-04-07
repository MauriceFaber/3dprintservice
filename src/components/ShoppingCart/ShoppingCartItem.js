import {
  faArrowLeft,
  faArrowRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useMaterial } from "../../contexts/MaterialContext";
import { useModel } from "../../contexts/ModelContext";
import { useShoppingCart } from "../../contexts/ShoppingCartContext";

export default function ShoppingCartItem({ position }) {
  const { loadModel } = useModel();
  const { changePosition } = useShoppingCart();
  const { setMaterial } = useMaterial();

  function addOne() {
    changePosition(position.name, position.count + 1, position.color);
  }

  function substractOne() {
    changePosition(position.name, position.count - 1, position.color);
  }

  const singlePriceDisplay = `${position.singlePrice.toFixed(2)}€`;
  const fullPriceDisplay = `${(position.singlePrice * position.count).toFixed(
    2
  )}€`;

  async function open() {
    await setMaterial(position.color);
    await loadModel(position.name, position.blob);
    window.location.href = "/configurator";
  }

  return (
    <tr className="shopping-cart-item">
      <td>
        <a onClick={open} className="cart-item-name" href="#">
          {!position.isSum ? position.name : <b>Total</b>}
        </a>
      </td>
      <td>
        <div
          className="colorBox"
          style={{
            backgroundColor: position.color?.color
              ? position.color.color
              : "white",
          }}
        ></div>
      </td>
      {/* <td>{!position.isSum ? singlePriceDisplay : null}</td> */}
      <td>
        {!position.isSum ? (
          <>
            <FontAwesomeIcon
              className="button"
              onClick={substractOne}
              icon={faMinus}
            />
            &nbsp;
            <span className="count">{position.count}</span>
            &nbsp;
            <FontAwesomeIcon
              className="button"
              onClick={addOne}
              icon={faPlus}
            />
          </>
        ) : null}
      </td>
      <td width="10">{fullPriceDisplay}</td>
    </tr>
  );
}
