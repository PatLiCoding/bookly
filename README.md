<div align="center">

#  Bookly

**A small, clean bookstore built with React, TypeScript and Supabase**

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white&style=for-the-badge)

[Live Demo](https://patricia-linne.de/bookly/) · [Features](#features) · [Installation](#installation) · [Roadmap](#roadmap)

> [!WARNING]
> **Work in progress.** This project is still under development and is a portfolio/learning project. Features may be incomplete, and legal pages such as the imprint and privacy policy are not final yet. Please do not enter real personal data on the demo site, and note that no real orders are processed.

<img src="public/assets/img/home.png" alt="Bookly home page" width="800">

</div>

---

##  About

Bookly is a small online bookstore. Visitors can browse, search and filter books and add them to their cart without an account. An account is required to place an order. Registered users can rate and comment on books, manage their profile and track their orders including shipping status.

##  Features

**Books**
- Book overview and detail pages for all visitors
- Search by title and author
- Filter by category and star rating (combinable), sort by price
- Pagination, highlights (top rated) and new releases on the home page

**Cart & Orders**
- Cart works without login, item count in the header, persisted via `localStorage`
- Checkout requires an account
- Order overview and details with status: 🟡 In progress · 🔵 Shipped · 🟢 Delivered

**Users**
- Register, log in, log out
- Edit profile, delete account (with confirmation)
- Ratings and comments (one rating per user and book), editable and deletable

**Privacy**
- Users can only see their own data, admins can manage user data

### Permissions

| Feature                   | Visitor | User | Admin |
|---------------------------|:-------:|:----:|:-----:|
| View and search books     | ✅ | ✅ | ✅ |
| Cart                      | ✅ | ✅ | ✅ |
| Like and comment          | ❌ | ✅ | ✅ |
| Order and view status     | ❌ | ✅ | ✅ |
| Own data / account        | ❌ | ✅ | ✅ |
| View other users' data    | ❌ | ❌ | ✅ |

##  Tech Stack

| Area       | Technology |
|------------|------------|
| Frontend   | React, TypeScript, Vite |
| Routing    | React Router |
| State      | React Context (`AuthContext`, `CartContext`) and custom hooks |
| Backend    | Supabase (PostgreSQL), integration in progress |
| Styling    | CSS, responsive, font *Playfair Display* |

## Installation

**Requirements:** Node.js (LTS), npm and a free [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone <repository-url>
cd bookly
npm install
```

### 2. Set up Supabase

1. Create a new project at supabase.com.
2. In the **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates all tables: `books`, `profiles`, `reviews`, `delivery_addresses`, `orders`, `order_items`.
3. Under **Project Settings → API**, copy the project URL and the `anon` key.

### 3. Environment variables

Copy the template and fill in your values:

```bash
cp .env.template .env        # Windows (cmd): copy .env.template .env
```

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Imprint and privacy policy (public)
VITE_LEGAL_NAME="First Last"
VITE_LEGAL_STREET="Example Street 1"
VITE_LEGAL_ZIP="12345"
VITE_LEGAL_CITY="Example City"
VITE_LEGAL_COUNTRY="Germany"
VITE_LEGAL_EMAIL="you@example.com"
VITE_LEGAL_HOSTER="Hosting provider, city, country"
VITE_LEGAL_LOG_RETENTION="7 days"
VITE_LEGAL_SUPABASE_REGION="Frankfurt (EU)"
VITE_LEGAL_AUTHORITY="Data protection authority"
VITE_LEGAL_UPDATED="01.01.2026"
```

| Variable | Used by | Where to find it |
|----------|---------|------------------|
| `VITE_SUPABASE_URL` | App and seed script | *Project Settings → API → Project URL* |
| `VITE_SUPABASE_ANON_KEY` | App (browser) | *Project Settings → API → `anon` key* |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed script only | *Project Settings → API → `service_role` key* |
| `VITE_LEGAL_*` | Imprint and privacy policy pages | Your own details |

> ⚠️ **Keep the `service_role` key secret.** It bypasses all security rules (RLS). Never commit your `.env`, never give the key a `VITE_` prefix (Vite would bundle it into the browser code), and only use it in local scripts.
>
> The `VITE_LEGAL_*` values are built into the public site (imprint and privacy policy are public anyway). They are read at build time, so rebuild after changing them.
>
> The Supabase URL must not end with `/rest/v1/`.

### 4. Seed the books

The seed script inserts the sample books using the `service_role` key (the `anon` key is not allowed to write to `books`). It can safely be run more than once. All other tables fill up through normal use of the app (registration, orders, reviews).

```bash
npx tsx scripts/seed-books.ts
```

### 5. Start the app

```bash
npm run dev
```

The app is then available at `http://localhost:5173`.

### Admin account

Admins cannot be created through the app. After registering, set the role once in the Supabase dashboard (table `profiles`).

##  Build & Deployment

```bash
npm run build                          # production build
npx vite build --base=/subfolder/      # build for a subfolder
```

The router uses `import.meta.env.BASE_URL` as its `basename`. To make page reloads on sub-routes (e.g. `/orders`) work, the web server needs an `.htaccess` that rewrites to `index.html`.

## ⚖️ Imprint & Privacy Policy

The imprint (`/imprint`) and privacy policy (`/policy`) are rendered by one component, `LegalPage`, from the texts in `src/data/legal-content.ts`. Your personal details are read from the `VITE_LEGAL_*` variables in `.env`.

> The texts are sample texts written for this demo project. If you fork or reuse the project, adapt them to your own setup (hosting, services, data you process) and check them before publishing.

##  Project Structure

```text
src/
├── components/   Reusable building blocks (Header, Footer, BookCard, Auth, Modal …)
├── pages/        Pages (Home, CategoryPage, BookDetails, Cart, Checkout, Orders, Profile …)
├── context/      AuthProvider, CartProvider and their hooks
├── hooks/        Custom hooks (useCart, useCheckoutForm, useBookReviews …)
├── services/     Logic and data access (book, order, review, user, checkout services)
├── utils/        Helpers (paginate, price, book-cover, list-view …)
├── interface/    TypeScript types (User, Book, Order, CartItem …)
├── data/         Dummy data
├── App.tsx       Routes
└── main.tsx      Entry point
scripts/          Seed script for Supabase
```

Logic lives in `services/`, `hooks/` and `utils/`, while components only handle rendering. When the data source changes, only the services need to be adapted.

##  Design

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#223044` | Primary color, text |
| Blue | `#A7D8FF` | Accents |
| Light blue | `#CDEEFF` | Surfaces |
| Beige | `#FFE9C7` | Accents |
| Off-white | `#F7FAFF` | Background |

##  Roadmap

-  Book overview, category page, filters, pagination
-  Login, registration, profile page
-  Cart, checkout, orders with status
-  Ratings and comments
-  Supabase tables and seed script
-  Fully migrate the frontend to Supabase
-  Real authentication instead of dummy users
-  More filters (most reviews, release date)
-  Search and sorting on the reviews and orders pages

## Demo data

All books, descriptions, ratings and comments are fictional sample data created for demonstration purposes. Some texts and cover images were created with the help of AI.

## License
  
This project was developed as part of a web development learning project and serves as a portfolio application.

## Author

Developed by Patricia Linne
