import useAdminOrders from "../../hooks/use-admin-orders";
import type { OrderStatus } from "../../services/admin-service";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "processing", label: "🟡 In Bearbeitung" },
  { value: "shipped", label: "🔵 Versendet" },
  { value: "delivered", label: "🟢 Zugestellt" },
];

/** Admin page: all orders with a status dropdown. */
export default function AdminOrdersPage() {
  const { orders, names, changeStatus } = useAdminOrders();
  return (
    <main className="admin-page">
      <h1>Bestellungen verwalten</h1>
      <table className="admin-table">
        <thead>
          <tr><th>Nr.</th><th>Kunde</th><th>Datum</th><th>Summe</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{names[o.user_id] || "—"}</td>
              <td>{new Date(o.order_date).toLocaleDateString("de-DE")}</td>
              <td>{Number(o.total_price).toFixed(2)} €</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}