import { useAuth } from "../../context/use-auth";
import { useCartContext } from "../../context/use-cart-context";
import {formatPrice, calcSubtotal, calcShippingCost,
    calcTotal} from "../../utils/price";

/** Props for the checkout area and the summary. */
interface CheckoutProps {
  /** Error message shown below the checkout button. */
  errorMsg: string;
  /** Callback fired when the checkout button is clicked. */
  onCheckout: () => void;
}

/** Labeled price row of the summary. */
function SummaryRow({ label, value, isTotal = false }: {
  label: string;
  value: number;
  isTotal?: boolean;
}) {
  const className = isTotal
    ? "cart-summary-row cart-summary-row--total"
    : "cart-summary-row";

  return (
    <div className={className}>
      <span>{label}</span>
      <span>{formatPrice(value)}</span>
    </div>
  );
}

/** Hint shown to guests who cannot check out. */
function LoginHint() {
  return (
    <p className="cart-summary-hint">
      Bestellen ist nur mit einem Account möglich. Bitte im Header einloggen.
    </p>
  );
}

/** Checkout button, disabled for guests. */
function CheckoutButton({ disabled, onClick }: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="cart-summary-checkout-btn"
      onClick={onClick}
      disabled={disabled}
    >
      Zur Kasse gehen
    </button>
  );
}

/** Checkout button plus error and login messages. */
function CheckoutAction({ errorMsg, onCheckout }: CheckoutProps) {
  const { loggedUser } = useAuth();

  return (
    <>
      <CheckoutButton disabled={!loggedUser} onClick={onCheckout} />
      {errorMsg && <p className="cart-summary-error">{errorMsg}</p>}
      {!loggedUser && <LoginHint />}
    </>
  );
}

/** Price overview (subtotal, shipping, total) with checkout action. */
function CartSummary({ errorMsg, onCheckout }: CheckoutProps) {
  const { cartItems } = useCartContext();

  return (
    <aside className="cart-summary">
      <h3 className="cart-summary-title">Übersicht</h3>
      <SummaryRow label="Zwischensumme:" value={calcSubtotal(cartItems)} />
      <SummaryRow label="Versandkosten:" value={calcShippingCost(cartItems)} />
      <SummaryRow label="Gesamtsumme:" value={calcTotal(cartItems)} isTotal />
      <CheckoutAction errorMsg={errorMsg} onCheckout={onCheckout} />
    </aside>
  );
}

export default CartSummary;