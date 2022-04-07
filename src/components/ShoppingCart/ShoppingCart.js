import React from "react";
import { useShoppingCart } from "../../contexts/ShoppingCartContext";
import ShoppingCartItem from "./ShoppingCartItem";
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const { positions, clearCart } = useShoppingCart();
  const sum = positions.reduce(
    (partialSum, a) => partialSum + a.count * a.singlePrice,
    0
  );
  const tmpItem = {
    name: "all",
    singlePrice: sum,
    count: 1,
    isSum: true,
  };
  return (
    <div className="default-page">
      <h1>Shopping Cart</h1>
      {positions.length > 0 ? (
        <>
          <h2>Positions</h2>
          <table className="shopping-cart-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Color</th>
                {/* <th>Single price</th> */}
                <th>Count</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(function (position, index) {
                return (
                  <ShoppingCartItem
                    key={`${position.name}_${position.color.name}`}
                    position={position}
                  />
                );
              })}
              <ShoppingCartItem className="sum" key="sum" position={tmpItem} />
            </tbody>
          </table>
          <button onClick={clearCart} className="clear-cart-button">
            Clear
          </button>
        </>
      ) : (
        <p>No items in your shopping cart.</p>
      )}
    </div>
  );
}
