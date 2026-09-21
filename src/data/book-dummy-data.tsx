import type { Book } from "../interface/book";

export const highlightBooks: Book[] = [
  {
    id: 1,
    title: "Das Flüstern der Wälder",
    author: "Elena Vance",
    price: "14,99 €",
    rating: 5,
    cover: "/assets/img/bookcover_default.png",
    category: "Krimi",
  },
  {
    id: 2,
    title: "Die Nacht der Sterne",
    author: "Maximilian Schwarz",
    price: "16,00 €",
    rating: 4,
    cover: "/assets/img/bookcover_default.png",
    category: "Young Adult",
  },
  {
    id: 3,
    title: "Wege der Zeit",
    author: "Laura Berger",
    price: "16,00 €",
    rating: 3,
    cover: "/assets/img/bookcover_default.png",
    category: "Liebesroman",
  },
  {
    id: 4,
    title: "Am Ende des Meeres",
    author: "Jonas Brand",
    price: "16,00 €",
    rating: 0,
    cover: "/assets/img/bookcover_default.png",
    category: "Fantasy",
  },
];