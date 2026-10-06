import { Link } from "react-router-dom";
import { getDeliveryDate } from "../../services/checkout-service";

/**
 * Displays a thank you message along with the estimated order delivery date.
 */
function ConfirmationText() {
  return (
    <p>
      Vielen Dank für deine Bestellung. <br />
      Deine Lieferung wird voraussichtlich am{" "}
      <strong>{getDeliveryDate()}</strong> eintreffen.
    </p>
  );
}

/**
 * Displays post-purchase action buttons for navigation.
 */
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

/**
 * Order confirmation view rendered after a successful checkout completion.
 */
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
