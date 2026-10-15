import { supabase } from "../lib/supabase";
import type { AddressSnapshot } from "../interface/order";

export const PAGE_SIZE = 10;

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

/** Editable book properties object (all fields except unique identifier id). */
export type BookInput = Omit<AdminBook, "id">;

export interface AdminOrder {
  id: number;
  user_id: string | null; 
  total_price: number;
  order_date: string;
  status: OrderStatus;
  billing_address: AddressSnapshot | null;
  shipping_address: AddressSnapshot | null;
  customer: string;
}

export interface AdminOrderItem {
  id: number;
  book_id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface AdminReview {
  id: number;
  user_name: string;
  rating: number;
  text: string | null;
  created_at: string;
  books: { title: string } | null;
}

export interface AdminUser {
  id: string;
  firstname: string | null;
  lastname: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  country: string | null;
  role: "user" | "admin";
  banned_at: string | null; 
}

export interface AdminBook {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  cover: string | null;
  release_date: string | null;
  description: string | null;
  hidden: boolean;
}

/** Subset of book fields shown in admin list views (excluding heavy base64 cover strings). */
export type BookListItem = Pick<
  AdminBook,
  "id" | "title" | "author" | "category" | "price" | "hidden"
>;

const BOOK_COLUMNS = "id, title, author, category, price, hidden, cover, release_date, description";
const LIST_COLUMNS = "id, title, author, category, price, hidden";

/** Sanitizes search terms by stripping characters that could disrupt PostgREST query filters. */
function cleanTerm(term: string): string {
  return term.replace(/[,()%*\\]/g, " ").trim();
}

/** Computes the database query row index range [from, to] for pagination offsets. */
function pageRange(offset: number): [number, number] {
  return [offset, offset + PAGE_SIZE - 1];
}

/** Retrieves matching user profile IDs whose first or last names match the search term. */
async function userIdsByName(term: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .or(`firstname.ilike.%${term}%,lastname.ilike.%${term}%`)
    .limit(100);
  if (error) throw error;
  return (data ?? []).map((p) => p.id);
}

/** Maps a list of user profile IDs to their corresponding full name strings. */
async function namesByIds(ids: string[]): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname")
    .in("id", ids);
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((p) => [p.id, `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim()]),
  );
}

/** Constructs filter criteria for order searches matching order IDs or associated customer names. */
async function orderFilter(term: string): Promise<string> {
  const ids = await userIdsByName(term);
  const parts = ids.length ? [`user_id.in.(${ids.join(",")})`] : [];
  if (/^\d{1,9}$/.test(term)) parts.push(`id.eq.${term}`);
  return parts.join(",");
}

type OrderRow = Omit<AdminOrder, "customer">;

/** Fetches a single pagination page of raw order entries, sorted by creation date descending. */
async function fetchOrderRows(offset: number, filter: string | null): Promise<OrderRow[]> {
  let query = supabase.from("orders").select(
    "id, user_id, total_price, order_date, status, billing_address, shipping_address");
  if (filter) query = query.or(filter);
  const { data, error } = await query
    .order("order_date", { ascending: false })
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

/** Fetches all line items associated with a specific order ID. */
export async function fetchOrderItems(orderId: number): Promise<AdminOrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("id, book_id, title, author, price, quantity")
    .eq("order_id", orderId);
  if (error) throw error;
  return (data ?? []) as AdminOrderItem[];
}

/** Resolves the customer display name, falling back to invoice details if the account was deleted. */
function customerName(order: OrderRow, names: Record<string, string>): string {
  if (order.user_id) return names[order.user_id] || "—";
  return `${order.billing_address?.name ?? "Unbekannt"} (Konto gelöscht)`;
}

/** Enriches raw order rows with resolved customer names. */
async function withCustomers(rows: OrderRow[]): Promise<AdminOrder[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((o) => o.user_id).filter((id): id is string => id !== null);
  const names = ids.length ? await namesByIds([...new Set(ids)]) : {};
  return rows.map((o) => ({ ...o, customer: customerName(o, names) }));
}

/** Fetches a paginated list of orders, optionally filtered by search parameters. */
export async function fetchOrders(offset: number, search: string): Promise<AdminOrder[]> {
  const term = cleanTerm(search);
  const filter = term ? await orderFilter(term) : null;
  if (filter === "") return [];
  return withCustomers(await fetchOrderRows(offset, filter));
}

/** Updates an order's status and automatically sets the fulfillment delivery date when marked as delivered. */
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<void> {
  const delivered_date = status === "delivered" ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("orders")
    .update({ status, delivered_date })
    .eq("id", id);
  if (error) throw error;
}

/** Constructs review search filters targeting user names, review texts, or associated book titles. */
async function reviewFilter(term: string): Promise<string> {
  const { data, error } = await supabase
    .from("books")
    .select("id")
    .ilike("title", `%${term}%`)
    .limit(100);
  if (error) throw error;
  const parts = [`user_name.ilike.%${term}%`, `text.ilike.%${term}%`];
  if (data?.length) parts.push(`book_id.in.(${data.map((b) => b.id).join(",")})`);
  return parts.join(",");
}

/** Fetches a paginated list of reviews including related book titles, ordered by creation date descending. */
export async function fetchReviews(offset: number, search: string): Promise<AdminReview[]> {
  const term = cleanTerm(search);
  let query = supabase
    .from("reviews")
    .select("id, user_name, rating, text, created_at, books(title)");
  if (term) query = query.or(await reviewFilter(term));
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as unknown as AdminReview[];
}

/** Deletes a review record (permitted for administrators via Row Level Security policies). */
export async function deleteReview(id: number): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

/** Fetches a paginated list of user profiles, optionally filtered by name search terms. */
export async function fetchUsers(offset: number, search: string): Promise<AdminUser[]> {
  const term = cleanTerm(search);
  let query = supabase
    .from("profiles")
    .select("id, firstname, lastname, street, zip, city, country, role, banned_at");
  if (term) query = query.or(`firstname.ilike.%${term}%,lastname.ilike.%${term}%`);
  const { data, error } = await query
    .order("lastname", { ascending: true })
    .order("id")
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

/** Blocks or unblocks a target user account via database RPC function calls. */
export async function setUserBanned(id: string, banned: boolean): Promise<void> {
  const { error } = await supabase.rpc("admin_set_user_banned", { target: id, banned });
  if (error) throw error;
}

/** Fetches a paginated list of books, searchable by title, author, or category. */
export async function fetchBooks(offset: number, search: string): Promise<BookListItem[]> {
  const term = cleanTerm(search);
  let query = supabase.from("books").select(LIST_COLUMNS);
  if (term) {
    query = query.or(
      `title.ilike.%${term}%,author.ilike.%${term}%,category.ilike.%${term}%`,
    );
  }
  const { data, error } = await query
    .order("id", { ascending: false })
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as BookListItem[];
}

/** Loads a complete book record including cover image data for editing dialogs. */
export async function fetchBook(id: number): Promise<AdminBook> {
  const { data, error } = await supabase
    .from("books")
    .select(BOOK_COLUMNS)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as AdminBook;
}

/** Creates a new book record and returns its list-view attributes. */
export async function createBook(input: BookInput): Promise<BookListItem> {
  const { data, error } = await supabase
    .from("books")
    .insert(input)
    .select(LIST_COLUMNS)
    .single();
  if (error) throw error;
  return data as BookListItem;
}

/** Updates an existing book record and returns its updated list-view attributes. */
export async function updateBook(id: number, input: BookInput): Promise<BookListItem> {
  const { data, error } = await supabase
    .from("books")
    .update(input)
    .eq("id", id)
    .select(LIST_COLUMNS)
    .single();
  if (error) throw error;
  return data as BookListItem;
}

/** Deletes a user account via database RPC function, validating admin permissions and open orders. */
export async function deleteUserAccount(id: string): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_user", { target: id });
  if (error) {
    if (error.message.includes("open_orders")) {
      throw new Error("Dieser User hat noch offene Bestellungen und kann erst gelöscht werden, wenn diese zugestellt oder storniert sind.");
    }
    throw error;
  }
}