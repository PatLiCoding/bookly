export interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  cover?: string;
}

export type NewCartItem = Omit<CartItem, "quantity">;