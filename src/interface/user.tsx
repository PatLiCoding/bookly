import type { Order } from "./order";

export interface Delivery {
  id: number;
  Firstname: string;
  Lastname: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

export interface User {
  id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  deliveryAddress?: Delivery[];
  order?: Order[];
}