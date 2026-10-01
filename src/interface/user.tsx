import type { Review } from "./review";
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
  id: number;
  Firstname: string;
  Lastname: string;
  email: string;
  passwort: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  deliveryAddress?: Delivery[];
  reviews?: Review[];
  order?: Order[];
}