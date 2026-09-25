import type { User } from "../interface/user";

export const user: User[] = [
  {
    id: 1,
    Firstname: "Laura",
    Lastname: "Weber",
    email: "laura.weber@example.com",
    passwort: "Test",
    street: "Gartenweg 15",
    zip: "50667",
    city: "Berlin",
    country: "Deutschland",

    deliveryAddress: [
      {
        id: 1,
        Firstname: "Laura",
        Lastname: "Weber",
        street: "Gartenweg 15",
        zip: "50667",
        city: "Berlin",
        country: "Deutschland",
      },
      {
        id: 2,
        Firstname: "Laura",
        Lastname: "Weber",
        street: "Sonnenstraße 42",
        zip: "80331",
        city: "München",
        country: "Deutschland",
      },
      {
        id: 3,
        Firstname: "Laura",
        Lastname: "Weber",
        street: "Bahnhofstraße 8",
        zip: "04109",
        city: "Köln",
        country: "Deutschland",
      },
    ],

    reviews: [
      {
        id: 1,
        bookTitle: "Kleine Abenteuer",
        author: "Mia Sommer",
        rating: 5,
        date: "14.07.2026",
        text: "Eine schöne und leichte Geschichte für zwischendurch. Besonders die Charaktere haben mir sehr gut gefallen.",
      },
      {
        id: 2,
        bookTitle: "Das Rätsel im Wald",
        author: "Tom Keller",
        rating: 4,
        date: "03.08.2026",
        text: "Spannende Geschichte mit einigen überraschenden Wendungen. Das Ende hätte für mich etwas ausführlicher sein können.",
      },
      {
        id: 3,
        bookTitle: "Sterne über Avalon",
        author: "Lena Winter",
        rating: 5,
        date: "19.08.2026",
        text: "Die Welt ist wunderschön beschrieben und ich konnte das Buch kaum aus der Hand legen.",
      },
      {
        id: 4,
        bookTitle: "Der letzte Sommer",
        author: "Anna Berger",
        rating: 3,
        date: "02.09.2026",
        text: "Eine nette Geschichte mit sympathischen Charakteren. An einigen Stellen war mir die Handlung allerdings etwas zu vorhersehbar.",
      },
      {
        id: 5,
        bookTitle: "Zwischen zwei Welten",
        author: "Julia Sommer",
        rating: 4,
        date: "10.09.2026",
        text: "Die Geschichte hatte einige schöne Momente und die Idee hat mir gut gefallen. Insgesamt war die Handlung für mich aber etwas vorhersehbar.",
      },
    ],

    order: [
      {
        id: 1001,
        items: [
          {
            id: 1,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Kleine Abenteuer",
            author: "Mia Sommer",
            price: 11.99,
            quantity: 1,
          },
        ],
        totalPrice: 15.94,
        orderDate: "10.07.2026",
        deliveredDate: "30.07.2026",
        status: "delivered",
      },

      {
        id: 1002,
        items: [
          {
            id: 2,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Das Rätsel im Wald",
            author: "Tom Keller",
            price: 15.49,
            quantity: 1,
          },
          {
            id: 3,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Sterne über Avalon",
            author: "Lena Winter",
            price: 16.99,
            quantity: 1,
          },
        ],
        totalPrice: 36.43,
        orderDate: "01.08.2026",
        deliveredDate: "15.08.2026",
        status: "delivered",
      },

      {
        id: 1003,
        items: [
          {
            id: 4,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Der letzte Sommer",
            author: "Anna Berger",
            price: 13.49,
            quantity: 1,
          },
        ],
        totalPrice: 17.44,
        orderDate: "17.08.2026",
        status: "shipped",
      },

      {
        id: 1004,
        items: [
          {
            id: 5,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Geheimnisse der Sterne",
            author: "Nora Falk",
            price: 18.99,
            quantity: 1,
          },
          {
            id: 6,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Die kleine Buchhandlung",
            author: "Clara Meier",
            price: 12.99,
            quantity: 2,
          },
        ],
        totalPrice: 48.92,
        orderDate: "12.09.2026",
        status: "shipped",
      },

      {
        id: 1005,
        items: [
          {
            id: 7,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Zwischen zwei Welten",
            author: "Julia Sommer",
            price: 14.99,
            quantity: 1,
          },
        ],
        totalPrice: 18.94,
        orderDate: "20.09.2026",
        status: "processing",
      },

      {
        id: 1006,
        items: [
          {
            id: 8,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Das Geheimnis der alten Villa",
            author: "Nina Berger",
            price: 16.49,
            quantity: 1,
          },
          {
            id: 9,
            bookCover: "/assets/img/bookcover_default.png",
            title: "Sommer, Sonne, Chaos",
            author: "Lisa König",
            price: 12.99,
            quantity: 1,
          },
        ],
        totalPrice: 33.43,
        orderDate: "22.09.2026",
        status: "processing",
      },
    ],
  },
];