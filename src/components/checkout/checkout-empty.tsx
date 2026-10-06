import { Link } from "react-router-dom";

/**
 * Fallback view presented when the user navigates to checkout with an empty shopping cart.
 */
function CheckoutEmpty() {
  return (
    <section className="checkout-empty">
      <h2>Warenkorb ist leer</h2>
      <Link to="/">Weiter stöbern</Link>
    </section>
  );
}

export default CheckoutEmpty;