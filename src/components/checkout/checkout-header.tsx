import { Link } from "react-router-dom";

/**
 * Renders the checkout page header with a heading, subtext, and navigation back to the shopping cart.
 */
function CheckoutHeader() {
  return (
    <div className="checkout-header">
      <div>
        <h2>Bestellung abschließen</h2>
        <p>Bitte überprüfe deine Daten vor dem Kauf.</p>
      </div>
      <Link to="/cart">← Warenkorb</Link>
    </div>
  );
}

export default CheckoutHeader;