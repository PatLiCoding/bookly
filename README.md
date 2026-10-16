<div align="center">

# Bookly

**A small, clean bookstore built with React, TypeScript and Supabase**

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white&style=for-the-badge)

[Live Demo](https://patricia-linne.de/bookly/) · [Features](#features) · [Installation](#getting-started)

> [!WARNING]
> **Work in progress.** This project is still under development and is a portfolio/learning project. Please do not enter real personal data on the demo site, and note that no real orders are processed.

<img src="public/assets/img/home.png" alt="Bookly home page" width="800">

</div>

---

## About

Bookly is a small bookshop built with **React**, **TypeScript** and **Supabase**.
Visitors can browse, search and filter books and fill a shopping cart without an account.
Registered users can order books, follow the status of their orders, rate and comment on
books and manage their profile. Admins manage orders, books, reviews and users in a
dedicated admin area.
 
## Table of contents
 
- [Features](#features)
- [Roles and permissions](#roles-and-permissions)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Imprint and Privacy Policy](#imprint-and-privacy-policy)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Database](#database)
- [Business rules](#business-rules)
- [Admin area](#admin-area)
- [Data protection and retention](#data-protection-and-retention)
- [Code conventions](#code-conventions)
- [Design and styling](#design-and-styling)
- [Known limitations and roadmap](#known-limitations-and-roadmap)
- [Demo data](#demo-data)
- [License](#license)
- [Author](#author)
  
## Features
 
### Visitors (no account)
 
- Browse all books with cover, title, author, category, description, price, star rating and reviews
- Search by title and author
- Filter by category and star rating; filters can be combined
- Shopping cart with a live item counter in the header
- Responsive layout for phones, tablets and desktops
### Registered users
 
- Register, log in and log out
- Edit the own profile and delivery address, delete the own account
- Check out with separate billing and shipping address (an account is required to order)
- Follow the order status: *In Bearbeitung* → *Versendet* → *Zugestellt*, or *Storniert*
- Cancel an order while it is still being processed
- Rate books (1 to 5 stars) and write comments; one review per book, editable and deletable
- Reviews show the user's name, the star rating and the comment
### Admins
 
- See all orders including the stored shipping address and change their status
- Create, edit, hide and show books (with cover upload)
- Delete inappropriate reviews
- List users, block / unblock them and delete accounts
- Everything an admin may do is enforced by the database (Row Level Security), not only by the UI
## Roles and permissions
 
| Function | Visitor | User | Admin |
| --- | :---: | :---: | :---: |
| View, search and filter books | ✅ | ✅ | ✅ |
| Use the shopping cart | ✅ | ✅ | ✅ |
| Rate and comment on books | ❌ | ✅ | ✅ |
| Place an order | ❌ | ✅ | ✅ |
| See the status of own orders | ❌ | ✅ | ✅ |
| Edit own data, delete own account | ❌ | ✅ | ✅ |
| See all orders, change order status | ❌ | ❌ | ✅ |
| Create, edit, hide books | ❌ | ❌ | ✅ |
| Delete any review | ❌ | ❌ | ✅ |
| See other users' data, block and delete users | ❌ | ❌ | ✅ |
 
Normal users can only read and change their own personal data. The `role` column of a profile
cannot be changed through the API, so nobody can make themselves an admin.
 
## Tech stack
 
- **React** with function components and hooks, **TypeScript**, **Vite**
- **React Router** for navigation
- **Supabase**: PostgreSQL, Auth and Row Level Security (RLS)
- Plain CSS with CSS variables and native CSS nesting (no preprocessor), one stylesheet per page or component, font Playfair Display
- `tsx` to run the setup scripts in `scripts/`

## Getting started
 
### Prerequisites
 
- Node.js 20.6 or newer (the scripts use `--env-file`)
- A free [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone <repository-url>
cd bookly
npm install
```

### 2. Create the database

1. Create a new project at supabase.com.
2. In the **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates all tables: `books`, `profiles`, `reviews`, `delivery_addresses`, `orders`, `order_items`.
3. Under **Project Settings → API**, copy the project URL and the `anon` key.

>  **For existing databases:** If you already set up an older version of Bookly, you can apply the incremental changes step-by-step from the `sql/migrations/` folder.

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

| Variable                    | Used by                          | Where to find it                              |
| --------------------------- | -------------------------------- | --------------------------------------------- |
| `VITE_SUPABASE_URL`         | App and seed script              | _Project Settings → API → Project URL_        |
| `VITE_SUPABASE_ANON_KEY`    | App (browser)                    | _Project Settings → API → `anon` key_         |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed script only                 | _Project Settings → API → `service_role` key_ |
| `VITE_LEGAL_*`              | Imprint and privacy policy pages | Your own details                              |

> ⚠️ **Keep the `service_role` key secret.** It bypasses all security rules (RLS). Never commit your `.env`, never give the key a `VITE_` prefix (Vite would bundle it into the browser code), and only use it in local scripts.
>
> The `VITE_LEGAL_*` values are built into the public site (imprint and privacy policy are public anyway). They are read at build time, so rebuild after changing them.
>
> The Supabase URL must not end with `/rest/v1/`.

### 4. Seed the data
 
```bash
# demo books (and demo reviews)
npx tsx --env-file=.env scripts/seed-books.ts
 
# first admin account
npx tsx --env-file=.env scripts/seed-admin.ts
```
 
The scripts run locally and use the service role key, which must never be part of the frontend.
An admin can also be created by registering normally and setting `profiles.role` to `admin` in the
Supabase dashboard.

### 5. Run
 
```bash
npm run dev      # development server
npm run build    # type check and production build
```

## Imprint and Privacy Policy

The imprint (`/imprint`) and privacy policy (`/policy`) are rendered by one component, `LegalPage`, from the texts in `src/data/legal-content.ts`. Your personal details are read from the `VITE_LEGAL_*` variables in `.env`.

> The texts are sample texts written for this demo project. If you fork or reuse the project, adapt them to your own setup (hosting, services, data you process) and check them before publishing.
 
## Project structure
 
```text
src/
├── components/      UI building blocks (header, cart, checkout, admin, auth, search, ...)
├── constants/       Fixed lists, e.g. the book categories
├── context/         React contexts (auth, cart) and their hooks
├── hooks/           Reusable logic (paged lists, forms, dialogs, checkout, availability check)
├── interface/       TypeScript types (book, user, order, cart item, checkout)
├── lib/             Supabase client
├── pages/           One folder per route (home, book detail, cart, checkout, orders, profile, admin)
├── services/        All database access and business logic
├── styles/          Global CSS: design variables (variables.css) and shared patterns (shared.css)
└── utils/           Pure helper functions (prices, filters, covers, images, forms)
scripts/             Local setup scripts (seed books, seed admin)
sql/                 Policy sync script and migrations for existing databases
supabase/            Complete database schema (schema.sql) for a new Supabase project
```
 
## Architecture
 
The code is split into layers. A layer only talks to the one below it:
 
```text
pages → components → hooks → services → Supabase
                              utils (pure helpers, used by all layers)
```
 
- **Pages and components** only render and wire up user interaction.
- **Hooks** hold state and side effects (for example `usePagedList`, `useBookForm`, `useCheckoutGuard`).
- **Services** are the only place that talks to Supabase (`book-service`, `order-service`,
  `admin-service`, ...). A component never builds a query itself
- **Utils** are small pure functions without side effects.
The admin area reuses the same building blocks for every tab: `usePagedList` loads one page at a
time with server-side search and a "Mehr laden" button, `AdminList` renders the rows, and
`AdminMessageDialog` replaces the native `alert` and `confirm` dialogs.
 
## Database
 
### Tables
 
| Table | Purpose |
| --- | --- |
| `books` | Catalogue incl. cover (base64 data URL) and the `hidden` flag |
| `profiles` | One row per user: name, billing address, `role`, `banned_at` |
| `delivery_addresses` | Saved delivery addresses of a user |
| `reviews` | Rating and comment, unique per book and user |
| `orders` | Order header, status, and the billing and shipping address at purchase time |
| `order_items` | Ordered books with title, author and price copied at purchase time |
 
### Row Level Security
 
Every table has RLS enabled. In short:
 
- **Books and reviews** are readable by everyone. Books can only be changed by admins; reviews only by their author (admins may delete).
- **Profiles and delivery addresses**: users see and edit only their own, admins see all.
- **Orders and items**: users create and read their own orders (always created as `processing`); only admins change the status. Users may only cancel their own order while it is still processing.
- **`profiles.role` and `profiles.banned_at`** are not part of the column grants for `anon` and `authenticated`, so they cannot be written through the API.
  
### Database functions
 
| Function | Purpose |
| --- | --- |
| `is_admin()` | Helper used by the policies (`SECURITY DEFINER` avoids a policy loop) |
| `handle_new_user()` | Trigger: creates the profile when a user registers |
| `delete_own_account()` | Lets a user delete the own account; refused while orders are open |
| `admin_set_user_banned(target, banned)` | Admin only: blocks or unblocks a user |
| `admin_delete_user(target)` | Admin only: deletes a user; refused while orders are open |
| `sync_books_id_seq()` | Service role only: fixes the id counter after seeding books with fixed ids |
| `purge_expired_orders(years)` | Service role only: deletes orders after the retention period |
 
Functions that need elevated rights run as `SECURITY DEFINER`, check the caller's role inside and
are only granted to the roles that may call them.
 
## Business rules
 
### Orders and statuses
 
An order moves through these statuses:
 
| Status | Meaning | Set by |
| --- | --- | --- |
| `processing` | In Bearbeitung (initial status) | system |
| `shipped` | Versendet | admin |
| `delivered` | Zugestellt / angekommen | admin |
| `cancelled` | Storniert | admin, or the customer while `processing` |
 
At checkout the entered billing and shipping address are copied into the order
(`orders.billing_address`, `orders.shipping_address`), together with title, author and price of every
item. An old order therefore stays correct, even if the user changes their profile, the book
changes, or the account is deleted.
 
### Hiding instead of deleting books
 
Books are never deleted from the admin area, they are **hidden** (`books.hidden`):
 
- Hidden books do not appear in the shop (overview, search, categories, detail page) and cannot be ordered.
- They stay readable in the database, so old orders still show title and cover.
- An admin can show a hidden book again at any time.

### Cart and availability check
 
The cart lives in the browser and works without an account. Before checkout starts and again
when the order is submitted, the shop checks that every book is still available. Unavailable books are
removed from the cart and the user is sent back to the cart page with a notice that names the
removed books. No order is created in that case.
 
### Cover images
 
Covers are uploaded in the admin dialog, scaled down in the browser to a maximum width of 600 px and
stored as a base64 data URL in `books.cover`. PNG files stay PNG (transparency is kept); other
formats are converted to JPEG. Admin lists do not load covers; the cover is loaded when a book is
opened for editing.
 
### Blocking users
 
Admins can block a user. The block uses the ban feature of Supabase Auth (`banned_until`), so a
blocked user cannot log in. Open sessions are ended and cannot be refreshed; an access token that is
already issued stays valid until it expires (one hour by default). Orders and reviews stay untouched,
and the block can be lifted at any time. Admins cannot block themselves or other admins.
 
## Admin area
 
The admin area is available at `/admin` and only for users with the role `admin` (`AdminRoute`
redirects everybody else). It has four tabs, each with a search field that searches the data
in the database and a limited, paged list (newest first):
 
| Tab | What admins can do |
| --- | --- |
| Bestellungen | Search by order number or customer, see the shipping address, change the status (also cancel) |
| Bücher | Search by title, author or category; create and edit books in a dialog; cover upload; hide or show a book |
| Bewertungen | Search by book, user or comment text; delete reviews |
| User | Search by name; block and unblock users; delete users |
 
The UI check is only a convenience. Every admin action is also checked by the database.
 
## Data protection and retention
 
Two obligations have to fit together: users can have their data deleted, but shops must keep
accounting records for years. Bookly handles this in the following way (an orientation for this project, **not
legal advice**; the retention periods differ between sources, so check them with a tax advisor for
a real shop):
 
| Data | Where | On account deletion | Retention |
| --- | --- | --- | --- |
| Login, e-mail | Supabase Auth | deleted | immediately |
| Profile, delivery addresses | `profiles`, `delivery_addresses` | deleted | immediately |
| Reviews | `reviews` | deleted | immediately |
| Order incl. items and address snapshot | `orders`, `order_items` | **kept**, detached from the account (`user_id` becomes `null`) | 8 years after the end of the calendar year of the order, then `purge_expired_orders()` |
| Blocked accounts | `auth.users`, `profiles` | kept until the user asks for deletion | until then |
 
Further rules:
 
- Only what an invoice needs (name, address, items, prices, date) stays in an order. The data is only visible to admins.
- An account cannot be deleted while it has open orders (`processing` or `shipped`).
- The retention period is the parameter of `purge_expired_orders(retention_years)` (default 8) and
  can be changed in one place. The function can only be run with the service role, for example from the
  SQL editor or a scheduled job.
  
## Code conventions
 
- **Clean code**: small functions with one purpose (guideline: at most 14 lines per function), logic in hooks and services, no database access in components.
- **Documentation**: every function, hook and component has a short JSDoc comment; interfaces describe their fields.
- **Language**: code and comments are in English, the user interface is in German.
- **Naming**: one component per file, file names in `kebab-case`, hooks start with `use`.
- **Types**: no `any`; database rows are mapped to domain types in the services.
- **Security**: the service role key is only used in local scripts; everything else works with the anon key and RLS.
- **CSS**: no hard-coded project colors (use the variables), repeated patterns live in `shared.css`, one stylesheet per page or component.

## Design and styling

| Color      | Hex       | CSS variable  | Usage               |
| ---------- | --------- | ------------- | ------------------- |
| Navy       | `#223044` | `--c-text`    | Primary color, text |
| Blue       | `#A7D8FF` | `--c-border`  | Accents             |
| Light blue | `#CDEEFF` | `--c-light`   | Surfaces            |
| Beige      | `#FFE9C7` | `--c-accent`  | Accents             |
| Off-white  | `#F7FAFF` | `--c-bg`      | Background          |

### CSS structure

- `styles/variables.css` holds all colors, radii and shadows as CSS variables.
- `styles/shared.css` holds patterns that several pages use (cards, buttons, panels, scrollbar, modal overlay), grouped by the existing class names.
- `index.css` imports both files first, so every page and component stylesheet can use the variables and override the shared rules.
- Every page or component has its own stylesheet with only what is specific to it. Nesting (`&:hover`, `& span`) keeps related rules together.

**Where does a new style go?** A new color or shadow becomes a variable. A pattern used by two or more components goes into `shared.css`. Everything else stays in the stylesheet of its page or component.
 
## Known limitations and roadmap
 
- **Payment**: there is no real payment integration; "Kostenpflichtig bestellen" only creates the order.
- **Order creation is not atomic**: the order and its items are saved in two steps, and prices and the total come from the browser. A database function that creates the order in one transaction and reads the prices from `books` would close both gaps.
- **Covers as base64** keep the setup simple but make rows large. Supabase Storage would be the next step for many books.
- **No automated tests** yet.
- **Retention cleanup** (`purge_expired_orders`) has to be started manually; `pg_cron` could run it once a year.

## Demo data

All books, descriptions, ratings and comments are fictional sample data created for demonstration purposes. Some texts and cover images were created with the help of AI.

## License

This project was developed as part of a web development learning project and serves as a portfolio application.

## Author

Developed by Patricia Linne
