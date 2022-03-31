import React from "react";
import "./Button.css";

const STYLES = ["btn--primary", "btn-outline"];

const SIZES = ["btn--medium", "btn--large"];

/**
 * Stellt unterschiedliche Buttons dar.
 * @param children 
 * @param {number} type
 * Der Typ des Buttons.
 * @param {Event} onClick
 * Das Klick Event.
 * @param {number} buttonStyle
 * Der Style des Buttons
 * @param {number} buttonSize
 * Die Groesse des Buttons.
 * @returns 
 * Den benoetigten Button.
 */
export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <button
      className={`btn ${checkButtonStyle} ${checkButtonSize}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
