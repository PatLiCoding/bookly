import type { CartItem } from "../../interface/cart-item";
import { getDeliveryDate } from "../../services/checkout-service";
import {
  formatPrice,
  calcSubtotal,
  calcShippingCost,
  calcTotal,
} from "../../utils/price";

interface ItemsProps {
  items: CartItem[];
}

interface SummaryRowProps {
  label: string;
  value: number;
  isTotal?: boolean;
}

/** Eine Zeile der Lieferübersicht (Titel, Autor, Menge, Preis). */
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

/** Karte "Lieferumfang" mit allen Artikeln. */
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

/** Eine Zeile der Preisübersicht, optional hervorgehoben (Gesamtsumme). */
function SummaryRow({ label, value, isTotal = false }: SummaryRowProps) {
  const Tag = isTotal ? "strong" : "span";
  return (
    <div className={isTotal ? "checkout-summary-total" : undefined}>
      <Tag>{label}</Tag>
      <Tag>{formatPrice(value)}</Tag>
    </div>
  );
}

/** Zwischensumme, Versand und Gesamtsumme. */
function OrderSummary({ items }: ItemsProps) {
  return (
    <div className="checkout-card checkout-summary">
      <SummaryRow label="Zwischensumme" value={calcSubtotal(items)} />
      <SummaryRow label="Versand" value={calcShippingCost(items)} />
      <SummaryRow label="Gesamtsumme" value={calcTotal(items)} isTotal />
    </div>
  );
}

/** Hinweis auf das voraussichtliche Lieferdatum. */
function DeliveryInfo() {
  return (
    <div className="checkout-delivery-info">
      Voraussichtliche Lieferung: <strong>{getDeliveryDate()}</strong>
    </div>
  );
}

/** Lieferdatum, Artikelliste und Preisübersicht der Bestellung. */
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
