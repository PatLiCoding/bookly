export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

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