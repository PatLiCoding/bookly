/** Valid status lifecycle values for a customer order. */
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

/** Individual book item entry included in a processed order. */
export interface OrderItem {
  /** Unique item entry ID. */
  id: number;
  /** Reference ID of the ordered book. */
  bookId: number;
  /** Optional cover image thumbnail URL. */
  bookCover?: string;
  /** Title of the ordered book. */
  title: string;
  /** Author of the ordered book. */
  author: string;
  /** Purchased unit price. */
  price: number;
  /** Quantity of copies ordered. */
  quantity: number;
}

/** Complete order record containing item breakdown, date timestamps, and current state. */
export interface Order {
  /** Unique order reference number. */
  id: number;
  /** Array of purchased order items. */
  items: OrderItem[];
  /** Total calculated price amount for the order. */
  totalPrice: number;
  /** Timestamp string indicating when the order was placed. */
  orderDate: string;
  /** Optional delivery fulfillment date string. */
  deliveredDate?: string;
  /** Current processing state of the order. */
  status: OrderStatus;
}

/** Address copied into the order at purchase time (invoice, shipping, returns). */
export interface AddressSnapshot {
  name: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

/** Billing and shipping address of an order. */
export interface OrderAddresses {
  billing: AddressSnapshot;
  shipping: AddressSnapshot;
}