import { useState, useEffect, type MouseEvent, type ReactNode } from "react";
import useModalDialog from "../../hooks/use-modal-dialog";
import { fetchOrderItems, type AdminOrder, type AdminOrderItem } from "../../services/admin-service";
import { STATUS_LABEL } from "../../services/order-service";

interface Props {
  order: AdminOrder | null;
  onClose: () => void;
}

/** Converts an optional price value to a valid number. */
function toNum(val: number | string | undefined | null): number {
  if (val === undefined || val === null) return 0;
  const parsed = typeof val === "number" ? val : parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

/** Closes the modal dialog when clicking directly on the backdrop. */
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>): void {
  if (e.target === e.currentTarget) e.currentTarget.close();
}

/** Renders basic metadata of an order including ID, date, customer, and status. */
function OrderMeta({ order }: { order: AdminOrder }): ReactNode {
  const date = new Date(order.order_date).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  return (
    <div className="admin-order-details-section">
      <p><strong>Datum:</strong> {date}</p>
      <p><strong>Kunde:</strong> {order.customer}</p>
      <p><strong>Lieferstatus:</strong> {STATUS_LABEL[order.status] ?? order.status}</p>
    </div>
  );
}

/** Displays the formatted shipping address or a placeholder message if missing. */
function OrderAddress({ address }: { address: AdminOrder["shipping_address"] }): ReactNode {
  return (
    <div className="admin-order-details-section">
      <h3>Lieferadresse</h3>
      {address ? (
        <address className="admin-address-block">
          {address.name}<br />{address.street}<br />
          {address.zip} {address.city}<br />{address.country}
        </address>
      ) : (
        <p>Keine Adresse gespeichert</p>
      )}
    </div>
  );
}

/** Renders a single row for a purchased book item. */
function OrderItemRow({ item }: { item: AdminOrderItem }): ReactNode {
  const lineTotal = (toNum(item.price) * item.quantity).toFixed(2);
  return (
    <tr className="admin-order-item-row">
      <td className="admin-order-item-main">
        <strong>{item.title}</strong><br />
        <small className="admin-order-item-author">{item.author}</small>
      </td>
      <td className="admin-order-item-qty">{item.quantity}</td>
      <td className="admin-order-item-price">{lineTotal} €</td>
    </tr>
  );
}

/** Renders a tabular list of purchased books. */
function OrderItemsTable({ items }: { items: AdminOrderItem[] }): ReactNode {
  return (
    <div className="admin-order-details-section">
      <h3>Bücher</h3>
      <table className="admin-order-table">
        <thead>
          <tr>
            <th>Titel & Autor</th>
            <th className="admin-order-item-qty">Menge</th>
            <th className="admin-order-item-price">Preis</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: AdminOrderItem, idx: number) => (
            <OrderItemRow key={item.id ?? idx} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Calculates and displays subtotal, shipping costs, and grand total. */
function OrderSummary({ items, totalPrice }: { items: AdminOrderItem[]; totalPrice: number | string }): ReactNode {
  const subtotal = items.reduce((sum: number, item: AdminOrderItem) => sum + toNum(item.price) * (item.quantity ?? 1), 0);
  const shipping = Math.max(0, toNum(totalPrice) - subtotal);
  return (
    <div className="admin-order-details-section admin-order-summary">
      <div className="admin-summary-line"><span>Zwischensumme Bücher:</span><span>{subtotal.toFixed(2)} €</span></div>
      <div className="admin-summary-line"><span>Versandkosten:</span><span>{shipping > 0 ? `${shipping.toFixed(2)} €` : "Kostenlos"}</span></div>
      <div className="admin-summary-line admin-summary-total"><span>Gesamtsumme:</span><span>{toNum(totalPrice).toFixed(2)} €</span></div>
    </div>
  );
}

/** Modal dialog displaying detailed information about a selected order. */
export default function OrderDialog({ order, onClose }: Props): ReactNode {
  const ref = useModalDialog();
  const [items, setItems] = useState<AdminOrderItem[]>([]);

  useEffect(() => {
    if (order) fetchOrderItems(order.id).then(setItems).catch(() => setItems([]));
  }, [order]);

  if (!order) return null;
  return (
    <dialog ref={ref} className="admin-dialog" onClose={onClose} onClick={closeOnBackdrop}>
      <div className="admin-dialog-form">
        <h2>Bestellung #{order.id}</h2>
        <OrderMeta order={order} />
        <OrderAddress address={order.shipping_address} />
        <OrderItemsTable items={items} />
        <OrderSummary items={items} totalPrice={order.total_price} />
        <div className="admin-dialog-actions">
          <button type="button" className="admin-save-btn" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </dialog>
  );
}