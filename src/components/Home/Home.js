import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

export default function Home() {
  return (
    <div className="home-container fadeIn default-page">
      <h1 className="slideInFromTop2">Welcome</h1>
      <ul className="noList center-menu">
        <li>
          <a className="center-nav-links link1" href="/configurator">
            Configurator
          </a>
        </li>
        <li>
          <a className="center-nav-links link2" href="/aboutus">
            About us
          </a>
        </li>
      </ul>
    </div>
  );
}
