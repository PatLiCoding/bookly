import { Link } from "react-router-dom";

/** Überschrift der Checkout-Seite mit Link zurück zum Warenkorb. */
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
