import { supabase } from "../lib/supabase";
import type { Delivery, Role, User } from "../interface/user";

/** Internal database record schema for user profiles. */
interface ProfileRow {
  firstname: string | null;
  lastname: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  country: string | null;
  role: Role;
}

/** Internal database record schema for delivery address entities. */
interface DeliveryRow {
  id: number;
  firstname: string;
  lastname: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

/**
 * Maps delivery address database record to normalized domain entity model.
 *
 * @param row - Database delivery address row record.
 * @returns Formatted {@link Delivery} address entity.
 */
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

/**
 * Constructs consolidated {@link User} domain model from profile data and address records.
 *
 * @param id - Unique user identifier string.
 * @param email - Primary account email string.
 * @param p - Raw profile database row or `null`.
 * @param deliveries - List of delivery address row records.
 * @returns Populated user entity structure.
 */
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
    role: p?.role ?? "user",
    street: p?.street ?? undefined,
    zip: p?.zip ?? undefined,
    city: p?.city ?? undefined,
    country: p?.country ?? undefined,
    deliveryAddress: deliveries.map(mapDelivery),
    order: [],
  };
}

/**
 * Fetches user profile record from `profiles` database table.
 *
 * @param id - User primary key identifier.
 * @returns Profile record or `null` if not found.
 * @throws Database query error.
 */
async function fetchProfile(id: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Fetches all delivery addresses associated with specified user ID.
 *
 * @param userId - User primary key identifier.
 * @returns List of delivery address records.
 * @throws Database query error.
 */
async function fetchDeliveries(userId: string): Promise<DeliveryRow[]> {
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("id");
  if (error) throw error;
  return data ?? [];
}

/**
 * Asynchronously loads complete user profile and associated delivery address records.
 *
 * @param id - Target user ID.
 * @param email - User email address.
 * @returns Promise resolving to fully assembled {@link User} object.
 */
export async function loadUser(id: string, email: string): Promise<User> {
  const [profile, deliveries] = await Promise.all([
    fetchProfile(id),
    fetchDeliveries(id),
  ]);
  return mapUser(id, email, profile, deliveries);
}

/**
 * Filters and formats partial user profile fields into database row update object.
 *
 * @param u - Partial user model parameters.
 * @returns Cleaned key-value record ignoring undefined values.
 */
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

/**
 * Updates primary profile parameters in `profiles` database table.
 *
 * @param id - User ID targeting row.
 * @param update - Partial user values to update.
 * @throws Database update error.
 */
async function updateProfile(id: string, update: Partial<User>): Promise<void> {
  const row = profileRow(update);
  if (Object.keys(row).length === 0) return;
  const { error } = await supabase.from("profiles").update(row).eq("id", id);
  if (error) throw error;
}

/**
 * Formats delivery entity object into database row insertion structure.
 *
 * @param userId - Target user identifier.
 * @param d - Delivery address details model.
 * @returns Database record payload object.
 */
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

/**
 * Inserts new delivery address record into `delivery_addresses` table.
 *
 * @param userId - User ID associating address.
 * @param d - Delivery address to save.
 * @throws Database insertion error.
 */
async function insertDelivery(userId: string, d: Delivery): Promise<void> {
  const { error } = await supabase.from("delivery_addresses").insert(deliveryRow(userId, d));
  if (error) throw error;
}

/**
 * Updates existing delivery address record in `delivery_addresses` table.
 *
 * @param userId - User ID associated with address.
 * @param d - Delivery address data containing primary key ID.
 * @throws Database update error.
 */
async function updateDelivery(userId: string, d: Delivery): Promise<void> {
  const { error } = await supabase
    .from("delivery_addresses")
    .update(deliveryRow(userId, d))
    .eq("id", d.id);
  if (error) throw error;
}

/**
 * Saves primary delivery address, executing an update if existing ID is present or insert otherwise.
 *
 * @param user - Current user model state.
 * @param d - Delivery address model or `undefined`.
 */
async function saveDelivery(user: User, d: Delivery | undefined): Promise<void> {
  if (!d) return;
  const exists = user.deliveryAddress?.some((a) => a.id === d.id);
  await (exists ? updateDelivery(user.id, d) : insertDelivery(user.id, d));
}

/**
 * Persists updated profile attributes and primary delivery address to database storage.
 *
 * @param user - Base user model instance.
 * @param update - Partial profile updates to persist.
 */
export async function saveProfile(user: User, update: Partial<User>): Promise<void> {
  await updateProfile(user.id, update);
  await saveDelivery(user, update.deliveryAddress?.[0]);
}