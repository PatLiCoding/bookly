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
  cover: string;
  category: string;
  releaseDate?: string;
  description?: string;
  comments?: Comment[];
}
