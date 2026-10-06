import type { CartItem } from "../../interface/cart-item";
import { getDeliveryDate } from "../../services/checkout-service";
import {
  formatPrice,
  calcSubtotal,
  calcShippingCost,
  calcTotal,
} from "../../utils/price";

/** Props for components that render a collection of cart items. */
interface ItemsProps {
  /** Array of items currently in the cart. */
  items: CartItem[];
}

/** Props for rendering individual price summary rows. */
interface SummaryRowProps {
  /** Row descriptor text (e.g., "Zwischensumme"). */
  label: string;
  /** Monitory amount to display. */
  value: number;
  /** Whether this row displays the final grand total emphasis. */
  isTotal?: boolean;
}

/**
 * Renders an individual row showing book details, quantity, and line-item total price.
 */
function OrderItemRow({ item }: { item: CartItem }) {
  return (
    <div className="checkout-item">
      <div>
        <strong>{item.title}</strong> <span>{item.author}</span>
        <small>Menge: {item.quantity}</small>
      </div>
      <strong>{formatPrice(item.price * item.quantity)}</strong>
    </div>
  );
}

/**
 * Renders a card displaying the list of all ordered items.
 */
function OrderItems({ items }: ItemsProps) {
  return (
    <div className="checkout-card">
      <h3>Lieferumfang</h3>
      <div className="checkout-items">
        {items.map((item) => <OrderItemRow key={item.id} item={item} />)}
      </div>
    </div>
  );
}

/**
 * Renders a single row in the price calculation breakdown.
 */
function SummaryRow({ label, value, isTotal = false }: SummaryRowProps) {
  const Tag = isTotal ? "strong" : "span";
  return (
    <div className={isTotal ? "checkout-summary-total" : undefined}>
      <Tag>{label}</Tag>
      <Tag>{formatPrice(value)}</Tag>
    </div>
  );
}

/**
 * Displays the cost calculations including subtotal, shipping fees, and final grand total.
 */
function OrderSummary({ items }: ItemsProps) {
  return (
    <div className="checkout-card checkout-summary">
      <SummaryRow label="Zwischensumme" value={calcSubtotal(items)} />
      <SummaryRow label="Versand" value={calcShippingCost(items)} />
      <SummaryRow label="Gesamtsumme" value={calcTotal(items)} isTotal />
    </div>
  );
}

/**
 * Displays an estimated delivery timeline banner.
 */
function DeliveryInfo() {
  return (
    <div className="checkout-delivery-info">
      Voraussichtliche Lieferung: <strong>{getDeliveryDate()}</strong>
    </div>
  );
}

/**
 * Renders the entire order overview panel including delivery estimate, item breakdown, and pricing summary.
 */
function OrderOverview({ items }: ItemsProps) {
  return (
    <>
      <DeliveryInfo />
      <OrderItems items={items} />
      <OrderSummary items={items} />
    </>
  );
}

export default OrderOverview;