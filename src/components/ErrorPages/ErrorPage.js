import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css";
/**
 * Ausgabe der 404 Fehlermeldung
 * @returns
 * Fehlermeldungsseite
 */
export default function ErrorPage() {
  return (
    <div className="notFound">
      <b>404</b> PAGE NOT FOUND.
      <br />
      <Link to="/">Back home</Link>
    </div>
  );
}
