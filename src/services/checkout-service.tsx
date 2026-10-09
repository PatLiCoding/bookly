import type { User } from "../interface/user";
import type { Order } from "../interface/order";
import type { CartItem } from "../interface/cart-item";
import type { AddressConfig, Field, Values } from "../interface/checkout";
import { calcTotal } from "../utils/price";
import { buildUserUpdate } from "./user-service";
import { saveOrderToSupabase } from "./order-service";
import { findMissingBookIds } from "./book-service";

/** Configuration schema for billing address input fields. */
export const BILLING: AddressConfig = {
  title: "Rechnungsadresse",
  fields: [
    { key: "name", label: "Name" },
    { key: "street", label: "Straße & Hausnummer" },
    { key: "zip", label: "PLZ" },
    { key: "city", label: "Ort" },
    { key: "country", label: "Land" },
  ],
};

/** Configuration schema for shipping/delivery address input fields. */
export const SHIPPING: AddressConfig = {
  title: "Lieferadresse",
  fields: [
    { key: "Firstname", label: "Vorname" },
    { key: "Lastname", label: "Nachname" },
    { key: "street", label: "Straße & Hausnummer" },
    { key: "zip", label: "PLZ" },
    { key: "city", label: "Ort" },
    { key: "country", label: "Land" },
  ],
};

/**
 * Extracts initial shipping address form field values from a user entity.
 *
 * @param user - User model containing personal and delivery details.
 * @returns Key-value map of shipping form field values.
 */
export function initialShipping(user: User): Values {
  const d = user.deliveryAddress?.[0];
  return {
    Firstname: d?.Firstname ?? user.Firstname,
    Lastname: d?.Lastname ?? user.Lastname,
    street: d?.street ?? "",
    zip: String(d?.zip ?? ""),
    city: d?.city ?? "",
    country: d?.country ?? user.country ?? "Deutschland",
  };
}

/**
 * Extracts initial billing address form field values from a user entity.
 *
 * @param user - User model containing profile and billing information.
 * @returns Key-value map of billing form field values.
 */
export function initialBilling(user: User): Values {
  return {
    name: `${user.Firstname} ${user.Lastname}`.trim(),
    street: user.street ?? "",
    zip: String(user.zip ?? ""),
    city: user.city ?? "",
    country: user.country ?? "Deutschland",
  };
}

/**
 * Validates whether all configured form fields contain non-empty text strings.
 *
 * @param fields - List of structural form field definitions.
 * @param values - Form input values.
 * @returns `true` if every field is populated; otherwise `false`.
 */
function areFilled(fields: Field[], values: Values): boolean {
  return fields.every(({ key }) => Boolean(values[key]?.trim()));
}

/**
 * Validates checkout address entries and terms acceptance status.
 *
 * @param b - Billing address form field values.
 * @param s - Shipping address form field values.
 * @param agb - Checkbox state indicating terms acceptance.
 * @returns Empty string if valid, or a localized validation error message.
 */
export function validateCheckout(b: Values, s: Values, agb: boolean): string {
  if (!areFilled(BILLING.fields, b) || !areFilled(SHIPPING.fields, s)) {
    return "Bitte fülle alle Adressfelder aus.";
  }
  return agb ? "" : "Bitte stimme den AGB zu.";
}

/**
 * Maps raw checkout address form values into standardized user profile form state key names.
 *
 * @param billing - Billing address input values.
 * @param shipping - Shipping address input values.
 * @returns Key-value map normalized for user update actions.
 */
export function toFormData(billing: Values, shipping: Values): Values {
  return {
    billingStreet: billing.street,
    billingZip: billing.zip,
    billingCity: billing.city,
    billingCountry: billing.country,
    deliveryFirstname: shipping.Firstname,
    deliveryLastname: shipping.Lastname,
    deliveryStreet: shipping.street,
    deliveryZip: shipping.zip,
    deliveryCity: shipping.city,
    deliveryCountry: shipping.country,
  };
}

/**
 * Maps a single cart shopping item to an order item snapshot structure.
 *
 * @param item - Cart item model instance.
 * @returns Formatted order item structure.
 */
function toOrderItem(item: CartItem) {
  return {
    id: item.id,
    bookId: item.id,
    bookCover: item.cover ?? "./assets/img/bookcover_default.png",
    title: item.title,
    author: item.author,
    price: item.price,
    quantity: item.quantity,
  };
}

/**
 * Creates a local order snapshot object from active shopping cart items.
 *
 * @param items - Cart items to process into the order.
 * @returns Formatted order instance with calculated pricing and current timestamp.
 */
export function createOrder(items: CartItem[]): Order {
  return {
    id: Date.now(),
    items: items.map(toOrderItem),
    totalPrice: calcTotal(items),
    orderDate: new Date().toLocaleDateString("de-DE"),
    status: "processing",
  };
}

/**
 * Constructs an updated user object appending a newly placed order and modified profile values.
 *
 * @param user - Current user instance.
 * @param order - Newly created order object.
 * @param data - Updated checkout form field values.
 * @returns Updated user model instance.
 */
export function buildUpdatedUser(user: User, order: Order, data: Values): User {
  return {
    ...user,
    ...buildUserUpdate(user, data),
    order: [...(user.order ?? []), order],
  };
}

/**
 * Processes checkout order persistence into remote database and constructs updated user model.
 *
 * @param user - Authenticated user processing checkout.
 * @param items - Shopping cart items being purchased.
 * @param data - Form address input values.
 * @returns Object containing saved order entity and modified user state.
 */
export async function processCheckoutOrder(user: User, items: CartItem[], data: Values) {
  const cartBookIds = items.map((item) => item.id);
  const missingIds = await findMissingBookIds(cartBookIds);
  if (missingIds.length > 0) {
    throw new Error(
      "Einige Artikel aus Ihrem Warenkorb sind leider nicht mehr verfügbar. Bitte aktualisieren Sie Ihren Warenkorb."
    );
  }
  const order = createOrder(items);
  await saveOrderToSupabase(order, user.id);
  return { order, updatedUser: buildUpdatedUser(user, order, data) };
}

/**
 * Calculates estimated delivery date 7 days from current system date.
 *
 * @returns Formatted German localized date string (`DD.MM.YYYY`).
 */
export function getDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString("de-DE");
}