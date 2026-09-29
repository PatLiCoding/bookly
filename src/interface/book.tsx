export interface Comment {
  id: string | number;
  userName: string;
  rating: number;
  text: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  rating: number;
  reviewCount: number;
  cover: string;
  category: string;
  releaseDate?: string;
  description?: string;
}

export type BookBase = Omit<Book, "rating" | "reviewCount">;