import React, { useState } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import { Button } from "./Button";
import { useShoppingCart } from "../../contexts/ShoppingCartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

/**
 * Erstellt die Benutzeransicht entsprechend der Berechtigungen.
 * @returns
 * Ansicht nach Berechtigung.
 * Falls Admin wird zusatzlich Rechteverwaltung erstellt.
 */
export default function Navbar() {
  const [clicked, setClicked] = useState(false);
  const { positions } = useShoppingCart();

  const authenticated = false;

  function handleClick() {
    setClicked(!clicked);
  }

  function onSignOut() {
    window.location.href = "/";
  }

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        <a className="appCaption" href="/">
          3D Print Service
        </a>
      </h1>
      <ul className="nav-menu">
        <li>
          <a className="nav-links" href="/configurator">
            Configurator
          </a>
        </li>
        <li>
          <a className="nav-links" href="/aboutus">
            About us
          </a>
        </li>
        <li>
          <a className="nav-links visible relative" href="/cart">
            <FontAwesomeIcon icon={faCartShopping} />
            {positions.length > 0 ? (
              <span className="badge">{positions.length}</span>
            ) : null}
          </a>
        </li>

        {/* {MenuItems.map((item, index) => {
          if (item.title == "Abmelden") {
            return (
              <li key={index}>
                <a className={item.cName} onClick={onSignOut} href="#">
                  {item.title}
                </a>
              </li>
            );
          }

          return (
            <li key={index}>
              <a className={item.cName} href={item.url}>
                {item.title}
              </a>
            </li>
          );
        })} */}
      </ul>

      {/* {authenticated ? (
        <a href="#" onClick={onSignOut}>
          <Button>Abmelden</Button>
        </a>
      ) : (
        <a href="/login">
          <Button>Anmelden</Button>
        </a>
      )} */}
    </nav>
  );
}
