import { Link } from "react-router-dom";
import CartItemList from "../../components/cart/cart-item-list";
import CartSummary from "../../components/cart/cart-summary";
import { useCartContext } from "../../context/use-cart-context";
import { useCheckoutGuard } from "../../hooks/use-checkout-guard";
import type { CartItem } from "../../interface/cart-item";
import "./cart-page.css";

/** Page title with a button that empties the cart. */
function CartHeader() {
  const { clearCart } = useCartContext();

  return (
    <div className="cart-page-header">
      <h2 className="cart-page-title">Warenkorb</h2>
      <button className="cart-clear-btn" onClick={clearCart}>
        Warenkorb leeren
        <img src="./assets/icons/delete_red.png" alt="Warenkorb leeren" />
      </button>
    </div>
  );
}

/** Message and link shown when the cart is empty. */
function EmptyMessage() {
  return (
    <div className="cart-empty">
      <p>Ihr Warenkorb ist leer.</p>
      <Link to="/" className="cart-empty-link">
        Weiter stöbern
      </Link>
    </div>
  );
}

/** Cart view without items. */
function EmptyCart() {
  return (
    <section className="cart-page">
      <div className="cart-page-header">
        <h2 className="cart-page-title">Warenkorb</h2>
      </div>
      <EmptyMessage />
    </section>
  );
}

/** Cart view with line items, summary and checkout. */
function FilledCart({ items }: { items: CartItem[] }) {
  const { errorMsg, handleCheckout } = useCheckoutGuard();

  return (
    <section className="cart-page">
      <CartHeader />
      <div className="cart-page-content">
        <CartItemList items={items} />
        <CartSummary errorMsg={errorMsg} onCheckout={handleCheckout} />
      </div>
    </section>
  );
}

/**
 * Renders the primary shopping cart view, handling line items, quantity adjustments,
 * subtotal calculations, guest checkout blocking, and navigation to checkout.
 */
function CartPage() {
  const { cartItems } = useCartContext();

  if (cartItems.length === 0) return <EmptyCart />;
  return <FilledCart items={cartItems} />;
}

export default CartPage;