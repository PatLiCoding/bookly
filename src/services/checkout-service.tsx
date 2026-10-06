import type { User } from "../interface/user";
import type { Order } from "../interface/order";
import type { CartItem } from "../interface/cart-item";
import type { AddressConfig, Field, Values } from "../interface/checkout";
import { calcTotal } from "../utils/price";
import { buildUserUpdate } from "./user-service";
import { saveOrderToSupabase } from "./order-service";

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

export function initialBilling(user: User): Values {
  return {
    name: `${user.Firstname} ${user.Lastname}`.trim(),
    street: user.street ?? "",
    zip: String(user.zip ?? ""),
    city: user.city ?? "",
    country: user.country ?? "Deutschland",
  };
}

function areFilled(fields: Field[], values: Values): boolean {
  return fields.every(({ key }) => Boolean(values[key]?.trim()));
}

export function validateCheckout(b: Values, s: Values, agb: boolean): string {
  if (!areFilled(BILLING.fields, b) || !areFilled(SHIPPING.fields, s)) {
    return "Bitte fülle alle Adressfelder aus.";
  }
  return agb ? "" : "Bitte stimme den AGB zu.";
}

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

export function createOrder(items: CartItem[]): Order {
  return {
    id: Date.now(),
    items: items.map(toOrderItem),
    totalPrice: calcTotal(items),
    orderDate: new Date().toLocaleDateString("de-DE"),
    status: "processing",
  };
}

export function buildUpdatedUser(user: User, order: Order, data: Values): User {
  return {
    ...user,
    ...buildUserUpdate(user, data),
    order: [...(user.order ?? []), order],
  };
}

export async function processCheckoutOrder(user: User, items: CartItem[], data: Values) {
  const order = createOrder(items);
  await saveOrderToSupabase(order, user.id);
  return { order, updatedUser: buildUpdatedUser(user, order, data) };
}

export function getDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString("de-DE");
}