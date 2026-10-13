import type { Order } from "./order";

/**
 * Access level of a user account. Set in Supabase (profiles.role).
 */
export type Role = "user" | "admin";

/**
 * Secondary delivery/shipping address record for a user.
 */
export interface Delivery {
  /** Unique delivery address ID. */
  id: number;
  /** Recipient first name. */
  Firstname: string;
  /** Recipient last name. */
  Lastname: string;
  /** Street address and house number. */
  street: string;
  /** Postal code / ZIP. */
  zip: string;
  /** City name. */
  city: string;
  /** Country name. */
  country: string;
}

/**
 * User account profile entity containing personal identification, address info, and order history.
 */
export interface User {
  /** Unique authentication user ID. */
  id: string;
  /** Account owner first name. */
  Firstname: string;
  /** Account owner last name. */
  Lastname: string;
  /** Registered email address. */
  email: string;
  /** Optional primary billing street address. */
  street?: string;
  /** Optional primary billing postal code / ZIP. */
  zip?: string;
  /** Optional primary billing city. */
  city?: string;
  /** Optional primary billing country. */
  country?: string;
  /** Optional list of alternate saved delivery addresses. */
  deliveryAddress?: Delivery[];
  /** Optional list of historical user orders. */
  order?: Order[];
  /** Access level; admins can manage orders and view all users. */
  role?: Role;
}