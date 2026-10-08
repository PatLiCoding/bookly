import React from "react";
import "./quantity-control.css";

/** Props for the QuantityControl component. */
interface Props {
  /** The current quantity count to display. */
  quantity: number;
  /** Callback fired when the user clicks the increase button. */
  onIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback fired when the user clicks the decrease button. */
  onDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional size variant for adjusting visual dimensions. Defaults to `"medium"`. */
  size?: "small" | "medium";
}

/**
 * Renders an interactive quantity selector with increment (+) and decrement (-) buttons.
 */
export function QuantityControl({
  quantity,onIncrease, onDecrease, size = "medium",}: Props) {
  return (
    <div className={`quantity-control quantity-control--${size}`}>
      <button onClick={onDecrease} aria-label="Menge verringern" type="button">
        -
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease} aria-label="Menge erhöhen" type="button">
        +
      </button>
    </div>
  );
}