import usePagedList from "../../hooks/use-paged-list";
import {
  fetchOrders, updateOrderStatus,
  type AdminOrder, type OrderStatus,
} from "../../services/admin-service";
import type { AddressSnapshot } from "../../interface/order";
import AdminList from "./admin-list";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "In Bearbeitung" },
  { value: "shipped", label: "Versendet" },
  { value: "delivered", label: "Zugestellt" },
  { value: "cancelled", label: "Storniert" },
];

interface RowProps {
  order: AdminOrder;
  onStatusChange: (id: number, status: OrderStatus) => void;
}

/** One-line address, or a hint if the order has no stored address. */
function addressLine(a: AddressSnapshot | null): string {
  if (!a) return "Keine Adresse gespeichert";
  return `${a.name}, ${a.street}, ${a.zip} ${a.city}, ${a.country}`;
}

/** One order: number, customer, date, total and status dropdown. */
function OrderRow({ order, onStatusChange }: RowProps) {
  const date = new Date(order.order_date).toLocaleDateString("de-DE");
  return (
    <>
      <div className="admin-row-main">
        <strong>#{order.id} · {order.customer}</strong>
        <span>{date} · {Number(order.total_price).toFixed(2)} €</span>
        <small>Lieferung an: {addressLine(order.shipping_address)}</small>
      </div>
      <select
        value={order.status}
        onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </>
  );
}

/** Orders tab: paged, searchable list with status management. */
export default function OrdersTab({ term }: { term: string }) {
  const list = usePagedList(fetchOrders, term);

  async function changeStatus(id: number, status: OrderStatus) {
    try {
      await updateOrderStatus(id, status);
      list.setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {
      window.alert("Status konnte nicht geändert werden.");
    }
  }

  return (
    <AdminList
      list={list}
      renderItem={(o) => <OrderRow order={o} onStatusChange={changeStatus} />}
    />
  );
}