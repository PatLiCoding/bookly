import { Link } from "react-router-dom";
import { getDeliveryDate } from "../../services/checkout-service";

/** Danke-Text mit voraussichtlichem Lieferdatum. */
function ConfirmationText() {
  return (
    <p>
      Vielen Dank für deine Bestellung. <br />
      Deine Lieferung wird voraussichtlich am{" "}
      <strong>{getDeliveryDate()}</strong> eintreffen.
    </p>
  );
}

/** Buttons nach erfolgreicher Bestellung. */
function ConfirmationActions() {
  return (
    <div className="checkout-confirmation-actions">
      <Link to="/order" className="checkout-confirmation-btn checkout-confirmation-btn--primary">
        Zu meinen Bestellungen
      </Link>
      <Link to="/" className="checkout-confirmation-btn checkout-confirmation-btn--secondary">
        Weiter stöbern
      </Link>
    </div>
  );
}

/** Bestätigungsseite nach erfolgreicher Bestellung. */
function CheckoutConfirmation() {
  return (
    <section className="checkout-confirmation">
      <div className="checkout-confirmation-icon">
        <img src="./assets/icons/check.png" alt="" />
      </div>
      <h2>Bestellung erfolgreich!</h2>
      <ConfirmationText />
      <ConfirmationActions />
    </section>
  );
}

export default CheckoutConfirmation;
