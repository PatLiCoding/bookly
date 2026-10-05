import { supabase } from "../lib/supabase";
import type { Delivery, User } from "../interface/user";

interface ProfileRow {
  firstname: string | null;
  lastname: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  country: string | null;
}

interface DeliveryRow {
  id: number;
  firstname: string;
  lastname: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

function mapDelivery(row: DeliveryRow): Delivery {
  return {
    id: row.id,
    Firstname: row.firstname,
    Lastname: row.lastname,
    street: row.street,
    zip: row.zip,
    city: row.city,
    country: row.country,
  };
}

function mapUser(
  id: string,
  email: string,
  p: ProfileRow | null,
  deliveries: DeliveryRow[],
): User {
  return {
    id,
    email,
    Firstname: p?.firstname ?? "",
    Lastname: p?.lastname ?? "",
    street: p?.street ?? undefined,
    zip: p?.zip ?? undefined,
    city: p?.city ?? undefined,
    country: p?.country ?? undefined,
    deliveryAddress: deliveries.map(mapDelivery),
    order: [],
  };
}

async function fetchProfile(id: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchDeliveries(userId: string): Promise<DeliveryRow[]> {
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("id");
  if (error) throw error;
  return data ?? [];
}

/** Loads the profile and the delivery addresses of a user. */
export async function loadUser(id: string, email: string): Promise<User> {
  const [profile, deliveries] = await Promise.all([
    fetchProfile(id),
    fetchDeliveries(id),
  ]);
  return mapUser(id, email, profile, deliveries);
}

/** Only the fields that were actually passed are written. */
function profileRow(u: Partial<User>) {
  const row = {
    firstname: u.Firstname,
    lastname: u.Lastname,
    street: u.street,
    zip: u.zip,
    city: u.city,
    country: u.country,
  };
  return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
}

async function updateProfile(id: string, update: Partial<User>): Promise<void> {
  const row = profileRow(update);
  if (Object.keys(row).length === 0) return;
  const { error } = await supabase.from("profiles").update(row).eq("id", id);
  if (error) throw error;
}

function deliveryRow(userId: string, d: Delivery) {
  return {
    user_id: userId,
    firstname: d.Firstname,
    lastname: d.Lastname,
    street: d.street,
    zip: String(d.zip),
    city: d.city,
    country: d.country,
  };
}

async function insertDelivery(userId: string, d: Delivery): Promise<void> {
  const { error } = await supabase.from("delivery_addresses").insert(deliveryRow(userId, d));
  if (error) throw error;
}

async function updateDelivery(userId: string, d: Delivery): Promise<void> {
  const { error } = await supabase
    .from("delivery_addresses")
    .update(deliveryRow(userId, d))
    .eq("id", d.id);
  if (error) throw error;
}

/** Saves the primary delivery address: update if it exists, otherwise insert. */
async function saveDelivery(user: User, d: Delivery | undefined): Promise<void> {
  if (!d) return;
  const exists = user.deliveryAddress?.some((a) => a.id === d.id);
  await (exists ? updateDelivery(user.id, d) : insertDelivery(user.id, d));
}

/** Saves profile fields and the primary delivery address of the user. */
export async function saveProfile(user: User, update: Partial<User>): Promise<void> {
  await updateProfile(user.id, update);
  await saveDelivery(user, update.deliveryAddress?.[0]);
}