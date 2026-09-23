export interface Delivery {
  id: number;
  Firstname: string;
  Lastname: string;
  street: string;
  zip: string;
  country: string;
}

export interface Review {
  id: number;
  bookTitle: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface Order {
  id: number;
  bookCover: string;
  title: string;
  author: string;
  price: number;
  orderDate: string;
  deliveredDate?: string;
  status: OrderStatus;
}

export interface User {
  id: number;
  Firstname: string;
  Lastname: string;
  email: string;
  passwort: string;
  street?: string;
  zip?: string;
  country?: string;
  deliveryAddress?: Delivery[];
  reviews?: Review[];
  order?: Order[];
}