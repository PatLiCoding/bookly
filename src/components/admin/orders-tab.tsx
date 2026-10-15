import { useState, type ReactNode } from "react";
import usePagedList from "../../hooks/use-paged-list";
import { fetchOrders, updateOrderStatus, type AdminOrder, type OrderStatus } from "../../services/admin-service";
import type { AddressSnapshot } from "../../interface/order";
import AdminList from "./admin-list";
import OrderDialog from "./order-dialog";
import AdminSelect from "./admin-select";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "In Bearbeitung" },
  { value: "shipped", label: "Versendet" },
  { value: "delivered", label: "Zugestellt" },
  { value: "cancelled", label: "Storniert" },
];

interface RowProps {
  order: AdminOrder;
  onStatusChange: (id: number, status: OrderStatus) => void;
  onClick: () => void;
}

/** Formats an address object into a single line string. */
function addressLine(a: AddressSnapshot | null): string {
  if (!a) return "Keine Adresse gespeichert";
  return `${a.name}, ${a.street}, ${a.zip} ${a.city}, ${a.country}`;
}

/** Renders a single order row with a clickable detailed overview button and a custom status dropdown. */
function OrderRow({ order, onStatusChange, onClick }: RowProps): ReactNode {
  const date = new Date(order.order_date).toLocaleDateString("de-DE");
  return (
    <>
      <button type="button" className="admin-row-click" onClick={onClick}>
        <div className="admin-row-main">
          <strong>#{order.id} · {order.customer}</strong>
          <span>{date} · {Number(order.total_price).toFixed(2)} €</span>
          <small>Lieferung an: {addressLine(order.shipping_address)}</small>
        </div>
      </button>
      <AdminSelect value={order.status} options={STATUS_OPTIONS} onChange={(status: OrderStatus) => onStatusChange(order.id, status)} />
    </>
  );
}

/** Orders tab component rendering a paginated order list with search, status management, and detail dialog. */
export default function OrdersTab({ term }: { term: string }): ReactNode {
  const list = usePagedList(fetchOrders, term);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  async function changeStatus(id: number, status: OrderStatus): Promise<void> {
    try {
      await updateOrderStatus(id, status);
      list.setItems((prev: AdminOrder[]) => prev.map((o: AdminOrder) => (o.id === id ? { ...o, status } : o)));
    } catch {
      window.alert("Status konnte nicht geändert werden.");
    }
  }

  return (
    <>
      <AdminList list={list} renderItem={(o: AdminOrder) => <OrderRow order={o} onStatusChange={changeStatus} onClick={() => setSelectedOrder(o)} />} />
      {selectedOrder && <OrderDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
}