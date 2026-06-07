# initial.md — Bootstrap Prompt

You are generating a production-grade eCommerce platform from scratch. Read every instruction carefully before writing a single file. Do not proceed step by step on your own — follow the exact order defined below.

---

## Before You Start

You have two companion files that define how this project must be built:

- `guidelines.md` — read this first. Every rule in it applies to every file you generate, without exception.
- `capabilities.md` — read this second. It defines every module, data shape, API route, and UI component you will build.

Do not generate any code until you have read both files in full.

---

## Project Overview

You are building a full-stack eCommerce store with the following stack:

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand + TanStack Query
- **Backend:** Node.js + Express + TypeScript
- **Database:** MySQL via Prisma ORM
- **Auth:** JWT stored in httpOnly cookie

The project lives in two folders at the root:
```
/client    ← React frontend
/server    ← Express backend
```

---

## Step 1 — Scaffold the project structure

Create the following folder structure. Do not write any logic yet — only create the folders and empty placeholder files.

```
/server
  /src
    /controllers
    /services
    /routes
    /middlewares
    /types
    /utils
  /prisma
    schema.prisma
    seed.ts
  app.ts
  server.ts
  .env
  tsconfig.json
  package.json

/client
  /src
    /components
    /pages
    /hooks
    /store
    /services
    /types
    /utils
  App.tsx
  main.tsx
  .env
  tsconfig.json
  package.json
  vite.config.ts
  tailwind.config.ts
  index.html
```

Confirm the structure is created before moving to Step 2.

---

## Step 2 — Configure the project

### Backend `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src",
    "resolveJsonModule": true,
    "skipLibCheck": true
  }
}
```

### Backend `package.json` dependencies to install:
```
express, prisma, @prisma/client, bcrypt, jsonwebtoken, cookie-parser, cors, dotenv
```
Dev dependencies:
```
typescript, ts-node, ts-node-dev, @types/express, @types/bcrypt, @types/jsonwebtoken, @types/cookie-parser, @types/cors, @types/node
```

### Frontend dependencies to install:
```
react, react-dom, react-router-dom, axios, zustand, @tanstack/react-query, framer-motion, tailwindcss, autoprefixer, postcss
```
Dev dependencies:
```
typescript, vite, @vitejs/plugin-react, @types/react, @types/react-dom
```

After installing, confirm all packages are installed before moving to Step 3.

---

## Step 3 — Database schema and seed

Write the full Prisma schema as defined in `capabilities.md` section 6.

Then write the seed file as defined in `capabilities.md` section 8 — 20 products across 4 categories with realistic data and picsum image URLs.

Set the provider in `schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

After writing schema and seed, run:
```
npx prisma migrate dev --name init
npx prisma db seed
```

Confirm migration and seed succeeded before moving to Step 4.

---

## Step 4 — Backend foundation

Build the following in order:

### 4.1 — AppError class
`src/utils/AppError.ts`
- Custom error class extending `Error`
- Constructor takes `message: string` and `statusCode: number`

### 4.2 — Global error middleware
`src/middlewares/error.middleware.ts`
- Catches all errors passed via `next(error)`
- Returns `{ message }` with the correct status code
- Falls back to `500` if no `statusCode` on the error

### 4.3 — Auth utilities
`src/utils/jwt.ts` — `signToken(userId)` and `verifyToken(token)` functions
`src/utils/hash.ts` — `hashPassword(password)` and `comparePassword(plain, hash)` functions

### 4.4 — Auth middleware
`src/middlewares/auth.middleware.ts`
- Reads JWT from `Authorization: Bearer <token>` header or `token` cookie
- Verifies token, attaches `req.user` typed as `{ id: string }`
- Throws `401` if missing or invalid

### 4.5 — Express app setup
`app.ts`
- Register cors, cookie-parser, express.json()
- Mount all routers under `/api`
- Register global error middleware last

### 4.6 — Server entry
`server.ts`
- Loads dotenv
- Starts the Express app on `PORT` from env

Confirm backend foundation is complete before moving to Step 5.

---

## Step 5 — Auth module

Build in this order: service → controller → route.

**Service** `src/services/auth.service.ts`:
- `register(name, email, password)` — check email not taken, hash password, create user, return signed JWT
- `login(email, password)` — find user, compare password, return signed JWT

**Controller** `src/controllers/auth.controller.ts`:
- `register` — calls `authService.register`, returns `201` with `{ token, user: { id, name, email } }`
- `login` — calls `authService.login`, returns `200` with `{ token, user: { id, name, email } }`

**Route** `src/routes/auth.route.ts`:
- `POST /api/auth/register` → register controller
- `POST /api/auth/login` → login controller

Confirm auth module is complete and routes are mounted in `app.ts` before moving to Step 6.

---

## Step 6 — Product module

**Service** `src/services/product.service.ts`:
- `getAll({ search, category, minPrice, maxPrice, page, limit })` — filtered, paginated query
- `getById(id)` — single product or throw `404`

**Controller** `src/controllers/product.controller.ts`:
- `getAll` — parse query params, call service, return products
- `getById` — parse `req.params.id`, call service, return product

**Route** `src/routes/product.route.ts`:
- `GET /api/products` → getAll (public)
- `GET /api/products/:id` → getById (public)

Confirm product module is complete before moving to Step 7.

---

## Step 7 — Cart module

**Service** `src/services/cart.service.ts`:
- `getCart(userId)` — return all cart items with product details
- `addItem(userId, productId, quantity)` — validate stock, add or increment item
- `updateItem(userId, itemId, quantity)` — validate stock, update quantity
- `removeItem(userId, itemId)` — delete item

**Controller** `src/controllers/cart.controller.ts`:
- `getCart`, `addItem`, `updateItem`, `removeItem`

**Route** `src/routes/cart.route.ts`:
- All routes protected by `authMiddleware`
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:itemId`
- `DELETE /api/cart/:itemId`

Confirm cart module is complete before moving to Step 8.

---

## Step 8 — Order module

**Service** `src/services/order.service.ts`:
- `createOrder(userId, shippingAddress)` — validate cart not empty, validate stock, create order + items, decrement stock, clear cart, return order
- `getOrders(userId)` — return all orders for user
- `getOrderById(userId, orderId)` — return single order or throw `404`

**Controller** `src/controllers/order.controller.ts`:
- `createOrder`, `getOrders`, `getOrderById`

**Route** `src/routes/order.route.ts`:
- All routes protected by `authMiddleware`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

Confirm order module is complete before moving to Step 9.

---

## Step 9 — Account module

**Service** `src/services/account.service.ts`:
- `getProfile(userId)` — return user without password
- `updateProfile(userId, { name, email })` — update and return updated user
- `changePassword(userId, currentPassword, newPassword)` — verify current, hash new, update

**Controller** `src/controllers/account.controller.ts`:
- `getProfile`, `updateProfile`, `changePassword`

**Route** `src/routes/account.route.ts`:
- All routes protected by `authMiddleware`
- `GET /api/account/profile`
- `PATCH /api/account/profile`
- `PATCH /api/account/password`

Confirm account module is complete before moving to Step 10.

---

## Step 10 — Frontend foundation

### 10.1 — Axios instance
`src/services/api.ts`
- Base URL from `VITE_API_URL`
- Attach JWT from Zustand store to every request via interceptor
- On `401` response, clear auth store and redirect to `/login`

### 10.2 — Auth store
`src/store/authStore.ts`
- Zustand store with: `user`, `token`, `login()`, `logout()`
- Persist to localStorage

### 10.3 — Cart store
`src/store/cartStore.ts`
- Zustand store with: `items`, `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Syncs with backend on mount

### 10.4 — Shared components
Build these reusable components in `src/components/ui/`:
- `Button.tsx` — variants: primary, secondary, ghost, danger
- `Input.tsx` — label, error state, helper text
- `Badge.tsx` — color variants for order status
- `Modal.tsx` — overlay with backdrop, accepts children
- `Skeleton.tsx` — animated loading placeholder
- `Navbar.tsx` — logo, nav links, cart icon with count badge, account dropdown
- `Footer.tsx` — simple, clean footer

### 10.5 — Router setup
`App.tsx` — configure React Router with these routes:
```
/               → HomePage
/products       → ProductsPage
/products/:id   → ProductDetailPage
/cart           → CartPage
/checkout       → CheckoutPage
/account        → AccountPage (protected)
/login          → LoginPage
/register       → RegisterPage
/order/:id      → OrderConfirmationPage
```

Confirm frontend foundation is complete before moving to Step 11.

---

## Step 11 — Frontend pages

Build each page in order. Every page must be visually premium — use Tailwind CSS for layout, Framer Motion for transitions and micro-interactions. No generic aesthetics.

### 11.1 — LoginPage & RegisterPage
- Clean centered card layout
- Form with validation
- Redirect to `/` on success
- Link between login and register

### 11.2 — HomePage
- Hero section with headline and CTA button linking to `/products`
- Featured products section (first 8 products from API)
- Smooth fade-in animations on scroll

### 11.3 — ProductsPage
- Search bar at the top
- Filter sidebar: category, price range
- Product grid with `ProductCard` components
- Pagination controls
- Loading skeletons while fetching

### 11.4 — ProductDetailPage
- Large product image
- Name, category badge, price, stock status
- Quantity selector
- Add to cart button with animation feedback
- Back to catalog link

### 11.5 — CartPage
- List of cart items with `CartItem` component
- Quantity controls per item
- Remove item button
- Order total
- Proceed to checkout button

### 11.6 — CheckoutPage
- 3-step flow: Shipping → Review → Confirmation
- Progress indicator showing current step
- `ShippingStep` — address form with validation
- `ReviewStep` — order summary with items and total
- `ConfirmationStep` — success message, order ID, link to account

### 11.7 — AccountPage
- Two tabs: Profile and Order History
- Profile tab — editable name and email form, separate password change form
- Order History tab — list of orders with status badge, date, total
- Click an order to see full detail

Confirm all pages are complete before moving to Step 12.

---

## Step 12 — Final checks

Run through this checklist and fix any issues found:

- [ ] Backend starts without errors: `npm run dev` in `/server`
- [ ] Frontend starts without errors: `npm run dev` in `/client`
- [ ] Database is seeded with 20 products
- [ ] Register and login flow works end to end
- [ ] Products load on the catalog page with filters working
- [ ] Adding to cart persists after page refresh
- [ ] Checkout creates an order and clears the cart
- [ ] Account page shows profile and order history
- [ ] All protected routes redirect to `/login` when unauthenticated
- [ ] No TypeScript errors (`tsc --noEmit` in both `/server` and `/client`)
- [ ] No `any` types anywhere in the codebase

Report any issues found during this checklist. Do not mark the project as complete until all items pass.

---

## General Rules (apply at all times)

- Follow `guidelines.md` for every file — no exceptions
- Build backend before frontend — never the other way around
- Confirm completion of each step before starting the next
- If you are unsure about a decision, ask before proceeding — do not guess
- Do not install packages not listed in Step 2
- Do not create files not defined in this prompt or in `capabilities.md`
- Before writing any file, show me the file path and a 2-line summary of what it will contain. Wait for me to say "proceed" before writing it. Do this for every single file without exception.