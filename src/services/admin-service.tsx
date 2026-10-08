import { supabase } from "../lib/supabase";

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface AdminOrder {
  id: number;
  user_id: string;
  total_price: number;
  order_date: string;
  status: OrderStatus;
}

/** Loads all orders, newest first (RLS allows this for admins only). */
export async function getAllOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, total_price, order_date, status")
    .order("order_date", { ascending: false });
  if (error) throw error;
  return data as AdminOrder[];
}

/** Changes the status; sets delivered_date when the order is delivered. */
export async function updateOrderStatus(id: number, status: OrderStatus) {
  const delivered_date = status === "delivered" ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("orders")
    .update({ status, delivered_date })
    .eq("id", id);
  if (error) throw error;
}

/** Maps user ids to full names for the order list. */
export async function getUserNames(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname");
  if (error) throw error;
  return Object.fromEntries(
    data.map((p) => [p.id, `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim()])
  );
}