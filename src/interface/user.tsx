export interface Delivery {
  id: number;
  Firstname: string;
  Lastname: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}

export interface Review {
  id: number;
  bookId: number;
  bookTitle: string;
  author: string;
  userId: number;
  userName: string;
  rating: number;
  date: string;
  text: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface OrderItem {
  id: number;
  bookId: number;
  bookCover?: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalPrice: number;
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
  city?: string;
  country?: string;
  deliveryAddress?: Delivery[];
  reviews?: Review[];
  order?: Order[];
}