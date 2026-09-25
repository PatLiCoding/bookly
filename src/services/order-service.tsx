import type { User, Order, OrderStatus } from "../interface/user";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt / angekommen",
};

/** Loads all orders of a user. */
export async function getOrders(user: User): Promise<Order[]> {
  return user.order ?? [];
}

/** Splits orders into history (delivered) and active (not yet delivered). */
export function splitOrdersByStatus(orders: Order[]): { history: Order[]; active: Order[] } {
  return {
    history: orders.filter((o) => o.status === "delivered"),
    active: orders.filter((o) => o.status !== "delivered"),
  };
}

/** Human-readable label for an order status. */
export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}