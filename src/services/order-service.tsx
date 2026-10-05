import type { User } from "../interface/user";
import type { Order, OrderStatus, OrderItem } from "../interface/order";
import { supabase } from "../lib/supabase";
import { getCover } from "../utils/book-cover";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt / angekommen",
  cancelled: "Storniert",
};

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("de-DE");
}

export async function insertOrderRow(order: Order, userId: string): Promise<number> {
  const payload = {
    user_id: userId,
    total_price: order.totalPrice,
    status: order.status,
    order_date: order.orderDate,
  };
  const { data, error } = await supabase.from("orders").insert([payload]).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function insertOrderItemsRows(order: Order, orderId: number) {
  const itemsPayload = order.items.map((item) => ({
    order_id: orderId,
    book_id: item.bookId,
    title: item.title,
    author: item.author,
    price: item.price,
    quantity: item.quantity,
  }));
  const { error } = await supabase.from("order_items").insert(itemsPayload);
  if (error) throw error;
}

export async function saveOrderToSupabase(order: Order, userId: string): Promise<Order> {
  const generatedId = await insertOrderRow(order, userId);
  await insertOrderItemsRows(order, generatedId);
  return { ...order, id: generatedId };
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  const rawCover = (row.book_cover ?? row.cover ?? row.bookCover) as string | undefined;
  return {
    id: Number(row.id),
    bookId: Number(row.book_id),
    bookCover: getCover(rawCover),
    title: String(row.title ?? ""),
    author: String(row.author ?? ""),
    price: Number(row.price),
    quantity: Number(row.quantity),
  };
}

function mapOrderRow(row: Record<string, unknown>): Order {
  const rawItems = Array.isArray(row.order_items) ? row.order_items : [];
  return {
    id: Number(row.id),
    items: rawItems.map((item) => mapOrderItem(item as Record<string, unknown>)),
    totalPrice: Number(row.total_price),
    orderDate: formatDate(row.order_date as string),
    deliveredDate: formatDate(row.delivered_date as string),
    status: (row.status as OrderStatus) ?? "processing",
  };
}

export async function getOrders(user: User): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error || !data) return user.order ?? [];
  return data.map((row) => mapOrderRow(row as Record<string, unknown>));
}

export async function getOrderById(orderId: string | number): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return mapOrderRow(data as Record<string, unknown>);
}

export function splitOrdersByStatus(orders: Order[]): { history: Order[]; active: Order[] } {
  return {
    history: orders.filter((o) => o.status === "delivered" || o.status === "cancelled"),
    active: orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled"),
  };
}

export async function cancelOrderInSupabase(orderId: string | number): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  return !error;
}

export async function cancelOrder(user: User, orderId: string | number): Promise<Order[]> {
  await cancelOrderInSupabase(orderId);
  return getOrders(user);
}

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}