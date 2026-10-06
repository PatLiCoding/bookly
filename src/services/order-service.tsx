import type { User } from "../interface/user";
import type { Order, OrderStatus, OrderItem } from "../interface/order";
import { supabase } from "../lib/supabase";
import { getCover } from "../utils/book-cover";

/** Mapping of order status keys to human-readable German labels. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Zugestellt / angekommen",
  cancelled: "Storniert",
};

/**
 * Formats date input string into localized German date notation (`DD.MM.YYYY`).
 *
 * @param dateStr - Raw date string or `null`/`undefined`.
 * @returns Formatted German date string or empty string if input is missing.
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("de-DE");
}

/**
 * Inserts primary order record header into database `orders` table.
 *
 * @param order - Order object containing metadata.
 * @param userId - Unique database identifier of ordering user.
 * @returns Database auto-generated order identifier primary key.
 * @throws Database error if insertion fails.
 */
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

/**
 * Inserts line item records associated with an order into `order_items` table.
 *
 * @param order - Order containing item detail snapshots.
 * @param orderId - Parent order primary key ID.
 * @throws Database error if batch insertion fails.
 */
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

/**
 * Persists complete order structure with parent order and line items to Supabase storage.
 *
 * @param order - Local order entity instance.
 * @param userId - Target user identifier.
 * @returns Saved order object updated with persistent primary key ID.
 */
export async function saveOrderToSupabase(order: Order, userId: string): Promise<Order> {
  const generatedId = await insertOrderRow(order, userId);
  await insertOrderItemsRows(order, generatedId);
  return { ...order, id: generatedId };
}

/**
 * Maps database record object into normalized {@link OrderItem} domain structure.
 *
 * @param row - Database item row record.
 * @returns Formatted order item entity.
 */
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

/**
 * Maps database order header record and nested item relations into {@link Order} model.
 *
 * @param row - Database order row record.
 * @returns Formatted order entity.
 */
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

/**
 * Fetches all persistent orders belonging to user from database, fallback to local user orders on error.
 *
 * @param user - Active user model instance.
 * @returns List of order objects ordered by ID descending.
 */
export async function getOrders(user: User): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error || !data) return user.order ?? [];
  return data.map((row) => mapOrderRow(row as Record<string, unknown>));
}

/**
 * Fetches a single order record by ID along with its associated order item entries.
 *
 * @param orderId - Primary key identifier of requested order.
 * @returns Order model object or `null` if not found.
 */
export async function getOrderById(orderId: string | number): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return mapOrderRow(data as Record<string, unknown>);
}

/**
 * Splits order collection into historical completed/cancelled orders and active pending orders.
 *
 * @param orders - Complete list of order entities.
 * @returns Object grouping orders into `history` and `active` categories.
 */
export function splitOrdersByStatus(orders: Order[]): { history: Order[]; active: Order[] } {
  return {
    history: orders.filter((o) => o.status === "delivered" || o.status === "cancelled"),
    active: orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled"),
  };
}

/**
 * Updates order record status in database to `cancelled`.
 *
 * @param orderId - Identifier of targeted order.
 * @returns `true` if update succeeded, otherwise `false`.
 */
export async function cancelOrderInSupabase(orderId: string | number): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  return !error;
}

/**
 * Cancels target order and fetches updated order list for user.
 *
 * @param user - User instance requesting cancellation.
 * @param orderId - Identifier of order to cancel.
 * @returns Promise resolving to updated list of user orders.
 */
export async function cancelOrder(user: User, orderId: string | number): Promise<Order[]> {
  await cancelOrderInSupabase(orderId);
  return getOrders(user);
}

/**
 * Translates status code key into user-facing German status label text.
 *
 * @param status - Order status identifier.
 * @returns Display text corresponding to status.
 */
export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}