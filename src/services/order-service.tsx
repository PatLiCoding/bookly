import type { User, Order, OrderStatus } from "../interface/user";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt / angekommen",
  cancelled: "Storniert",
};

/** Loads all orders of a user. */
export async function getOrders(user: User): Promise<Order[]> {
  return user.order ?? [];
}

/** Splits orders into history (delivered / cancelled) and active (processing / shipped). */
export function splitOrdersByStatus(orders: Order[]): { history: Order[]; active: Order[] } {
  return {
    history: orders.filter((o) => o.status === "delivered" || o.status === "cancelled"),
    active: orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled"),
  };
}

/** Cancels an active order if its status allows it. */
export async function cancelOrder(user: User, orderId: string | number): Promise<Order[]> {
  const currentOrders = user.order ?? [];
  const updatedOrders = currentOrders.map((order) => {
    if (String(order.id) === String(orderId) && order.status === "processing") {
      return { ...order, status: "cancelled" as OrderStatus };
    }
    return order;
  });
  user.order = updatedOrders;
  return updatedOrders;
}

/** Human-readable label for an order status. */
export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}