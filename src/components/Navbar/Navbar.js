import React, { useState } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import { Button } from "./Button";

/**
 * Erstellt die Benutzeransicht entsprechend der Berechtigungen.
 * @returns
 * Ansicht nach Berechtigung.
 * Falls Admin wird zusatzlich Rechteverwaltung erstellt.
 */
export default function Navbar() {
  const [clicked, setClicked] = useState(false);

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
          3D Druck Service
        </a>
        <img className="appIcon" src="/Lehsetreff.png" alt="icon"></img>
      </h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        <li>
          <a className="nav-links" href="/profile">
            Profil
          </a>
        </li>

        <li>
          <a href="/rightsManagement" className="nav-links">
            Rechteverwaltung
          </a>
        </li>

        {MenuItems.map((item, index) => {
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
        })}
      </ul>

      {authenticated ? (
        <a href="#" onClick={onSignOut}>
          <Button>Abmelden</Button>
        </a>
      ) : (
        <a href="/login">
          <Button>Anmelden</Button>
        </a>
      )}
    </nav>
  );
}
