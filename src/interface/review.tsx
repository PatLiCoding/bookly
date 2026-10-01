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