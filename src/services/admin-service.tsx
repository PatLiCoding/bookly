import { supabase } from "../lib/supabase";

export const PAGE_SIZE = 10;

export type OrderStatus = "processing" | "shipped" | "delivered";

/** Editable book fields (everything except the id). */
export type BookInput = Omit<AdminBook, "id">;

const BOOK_COLUMNS = "id, title, author, category, price, cover, release_date, description";

export interface AdminOrder {
  id: number;
  user_id: string;
  total_price: number;
  order_date: string;
  status: OrderStatus;
  customer: string;
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
}

/** Removes characters that would break a PostgREST filter string. */
function cleanTerm(term: string): string {
  return term.replace(/[,()%*\\]/g, " ").trim();
}

/** Row range [from, to] of the page starting at the given offset. */
function pageRange(offset: number): [number, number] {
  return [offset, offset + PAGE_SIZE - 1];
}

/** Ids of profiles whose first or last name contains the term. */
async function userIdsByName(term: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .or(`firstname.ilike.%${term}%,lastname.ilike.%${term}%`)
    .limit(100);
  if (error) throw error;
  return (data ?? []).map((p) => p.id);
}

/** Maps user ids to full names. */
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

/** Filter for the order search: order number or customer name. */
async function orderFilter(term: string): Promise<string> {
  const ids = await userIdsByName(term);
  const parts = ids.length ? [`user_id.in.(${ids.join(",")})`] : [];
  if (/^\d{1,9}$/.test(term)) parts.push(`id.eq.${term}`);
  return parts.join(",");
}

type OrderRow = Omit<AdminOrder, "customer">;

/** Loads one page of raw order rows, newest first. */
async function fetchOrderRows(offset: number, filter: string | null): Promise<OrderRow[]> {
  let query = supabase.from("orders").select("id, user_id, total_price, order_date, status");
  if (filter) query = query.or(filter);
  const { data, error } = await query
    .order("order_date", { ascending: false })
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

/** Adds the customer name to each order row. */
async function withCustomers(rows: OrderRow[]): Promise<AdminOrder[]> {
  if (rows.length === 0) return [];
  const names = await namesByIds([...new Set(rows.map((o) => o.user_id))]);
  return rows.map((o) => ({ ...o, customer: names[o.user_id] || "—" }));
}

/** One page of orders, optionally filtered by order number or customer. */
export async function fetchOrders(offset: number, search: string): Promise<AdminOrder[]> {
  const term = cleanTerm(search);
  const filter = term ? await orderFilter(term) : null;
  if (filter === "") return [];
  return withCustomers(await fetchOrderRows(offset, filter));
}

/** Changes the order status; sets delivered_date when delivered. */
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<void> {
  const delivered_date = status === "delivered" ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("orders")
    .update({ status, delivered_date })
    .eq("id", id);
  if (error) throw error;
}

/** Filter for the review search: user name, comment text or book title. */
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

/** One page of reviews with book title, newest first. */
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

/** Deletes a review (allowed for admins by the RLS policy). */
export async function deleteReview(id: number): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

/** One page of user profiles, optionally filtered by name. */
export async function fetchUsers(offset: number, search: string): Promise<AdminUser[]> {
  const term = cleanTerm(search);
  let query = supabase
    .from("profiles")
    .select("id, firstname, lastname, street, zip, city, country, role");
  if (term) query = query.or(`firstname.ilike.%${term}%,lastname.ilike.%${term}%`);
  const { data, error } = await query
    .order("lastname", { ascending: true })
    .order("id")
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

/** One page of books (newest first), searchable by title, author or category. */
export async function fetchBooks(offset: number, search: string): Promise<AdminBook[]> {
  const term = cleanTerm(search);
  let query = supabase.from("books").select(BOOK_COLUMNS);
  if (term) {
    query = query.or(
      `title.ilike.%${term}%,author.ilike.%${term}%,category.ilike.%${term}%`,
    );
  }
  const { data, error } = await query
    .order("id", { ascending: false })
    .range(...pageRange(offset));
  if (error) throw error;
  return (data ?? []) as AdminBook[];
}

/** Creates a book and returns the saved row. */
export async function createBook(input: BookInput): Promise<AdminBook> {
  const { data, error } = await supabase
    .from("books")
    .insert(input)
    .select(BOOK_COLUMNS)
    .single();
  if (error) throw error;
  return data as AdminBook;
}

/** Updates a book and returns the saved row. */
export async function updateBook(id: number, input: BookInput): Promise<AdminBook> {
  const { data, error } = await supabase
    .from("books")
    .update(input)
    .eq("id", id)
    .select(BOOK_COLUMNS)
    .single();
  if (error) throw error;
  return data as AdminBook;
}