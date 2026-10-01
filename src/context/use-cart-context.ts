import { useContext } from "react";
import { CartContext } from "./cart-context";

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCartContext muss innerhalb eines CartProviders verwendet werden",
    );
  }
  return context;
}
