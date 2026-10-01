import { Link } from "react-router-dom";

/** Anzeige, wenn der Warenkorb leer ist. */
function CheckoutEmpty() {
  return (
    <section className="checkout-empty">
      <h2>Warenkorb ist leer</h2>
      <Link to="/">Weiter stöbern</Link>
    </section>
  );
}

export default CheckoutEmpty;
