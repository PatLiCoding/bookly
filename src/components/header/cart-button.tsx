import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/use-cart-context";
import { useHover } from "../../hooks/use-hover";

/** Cart icon with live item counter; opens the cart page on click. */
function CartButton() {
  const { cartCount } = useCartContext();
  const { isHovered, hoverProps } = useHover();
  const navigate = useNavigate();
  const icon = isHovered ? "cart_hover" : "cart_default";

  return (
    <div className="cart" {...hoverProps} onClick={() => navigate("/cart")}>
      <img className="cart-image" src={`./assets/icons/${icon}.png`} alt="Cart" />
      <span className="cart-count">{cartCount}</span>
    </div>
  );
}

export default CartButton;