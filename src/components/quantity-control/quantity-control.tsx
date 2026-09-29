import React from "react";
import "./quantity-control.css";

interface Props {
  quantity: number;
  onIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: "small" | "medium";
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  size = "medium",
}: Props) {
  return (
    <div className={`quantity-control quantity-control--${size}`}>
      <button
        onClick={onDecrease}
        aria-label="Menge verringern"
        type="button"
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        onClick={onIncrease}
        aria-label="Menge erhöhen"
        type="button"
      >
        +
      </button>
    </div>
  );
}