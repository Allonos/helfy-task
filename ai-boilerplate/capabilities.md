# Capability Definitions

These are the functional building blocks available for generating the eCommerce platform. Each capability describes what exists, what it does, and how it should be composed.

---

## 1. Authentication Module

**What it covers:** registration, login, logout, session persistence, route protection

**Backend:**
- `POST /api/auth/register` — validate input, hash password, create user, return JWT
- `POST /api/auth/login` — validate credentials, return JWT
- `POST /api/auth/logout` — clear token/cookie
- `authMiddleware` — validates JWT, attaches typed `req.user` to every protected request

**Frontend:**
- `useAuth` hook — exposes `user`, `login()`, `logout()`, `isAuthenticated`
- Zustand `authStore` — persists user session across page refreshes
- Protected route wrapper component — redirects unauthenticated users to `/login`
- Login and Register pages with form validation

**Rules:**
- Never store raw passwords
- Never return password hash in any response
- JWT secret must come from environment variable `JWT_SECRET`
- Token expiry: 7 days

---

## 2. Product Catalog Module

**What it covers:** listing products, searching, filtering, single product view

**Backend:**
- `GET /api/products` — returns paginated product list, supports query params:
  - `search` — fuzzy match on name and description
  - `category` — filter by category
  - `minPrice` / `maxPrice` — price range filter
  - `page` / `limit` — pagination
- `GET /api/products/:id` — returns single product with full details

**Frontend:**
- Product listing page with search bar, filter sidebar, and product grid
- `ProductCard` component — image, name, price, add to cart button
- Product detail page — full image, description, price, quantity selector, add to cart
- `useProducts` hook — wraps TanStack Query for fetching and caching product data
- Loading skeletons while data fetches
- Empty state when no products match filters

**Data shape:**
```ts
interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  createdAt: Date
}
```

---

## 3. Cart Module

**What it covers:** adding items, updating quantities, removing items, persisting cart

**Backend:**
- `GET /api/cart` — returns current user's cart with product details
- `POST /api/cart` — add item `{ productId, quantity }`
- `PATCH /api/cart/:itemId` — update quantity
- `DELETE /api/cart/:itemId` — remove item
- Cart is tied to authenticated user, persisted in database

**Frontend:**
- Zustand `cartStore` — mirrors server cart for instant UI updates
- Cart sidebar/drawer — slides in from right, shows all items, totals, checkout button
- `CartItem` component — product image, name, quantity controls, remove button
- Cart icon in navbar with item count badge
- Optimistic updates — UI updates instantly, syncs with server in background

**Rules:**
- Quantity can never go below 1 — use PATCH to update, DELETE to remove
- Stock must be validated on add — throw `400` if quantity exceeds available stock
- Cart total calculated on the backend, not the frontend

---

## 4. Checkout Module

**What it covers:** multi-step checkout flow, order creation

**Steps:**
1. **Shipping** — address form (name, address, city, country, postal code)
2. **Review** — order summary, cart items, total price
3. **Confirmation** — order placed, order ID shown, cart cleared

**Backend:**
- `POST /api/orders` — creates order from current cart, clears cart, returns order
- Validates stock availability before creating order
- Decrements stock on each ordered product

**Frontend:**
- Multi-step form with progress indicator
- `useCheckout` hook — manages step state and form data
- Each step is a separate component: `ShippingStep`, `ReviewStep`, `ConfirmationStep`
- Form validation on each step before proceeding to next

**Data shape:**
```ts
interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: ShippingAddress
  createdAt: Date
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  country: string
  postalCode: string
}
```

---

## 5. Account Module

**What it covers:** profile management, order history

**Backend:**
- `GET /api/account/profile` — returns current user profile
- `PATCH /api/account/profile` — update name, email
- `PATCH /api/account/password` — change password (requires current password)
- `GET /api/account/orders` — returns paginated order history for current user
- `GET /api/account/orders/:id` — returns single order detail

**Frontend:**
- Account page with two tabs: Profile and Order History
- Profile tab — editable form for name and email, separate password change section
- Order History tab — list of past orders with status badge, date, total, items summary
- Order detail view — full breakdown of a single order

---

## 6. Database Schema

All models defined in Prisma. Relationships:
- `User` has many `CartItem`, `Order`
- `Order` has many `OrderItem`
- `OrderItem` references `Product`
- `CartItem` references `Product`

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  name      String
  cart      CartItem[]
  orders    Order[]
  createdAt DateTime   @default(now())
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int
  category    String
  imageUrl    String
  cartItems   CartItem[]
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model CartItem {
  id        String  @id @default(uuid())
  userId    String
  productId String
  quantity  Int
  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model Order {
  id              String        @id @default(uuid())
  userId          String
  total           Float
  status          String        @default("pending")
  shippingAddress Json
  items           OrderItem[]
  user            User          @relation(fields: [userId], references: [id])
  createdAt       DateTime      @default(now())
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

---

## 7. UI Composition

**Styling:** Tailwind CSS for layout and utility classes, Framer Motion for animations

**Design standard:** visually premium — clean typography, consistent spacing, smooth transitions, no generic AI aesthetics

**Shared components to generate:**
- `Button` — variants: primary, secondary, ghost, danger
- `Input` — with label, error state, helper text
- `Badge` — for order status, category tags
- `Modal` — reusable overlay with backdrop
- `Skeleton` — loading placeholder matching component shape
- `Navbar` — logo, navigation links, cart icon, account menu
- `Footer` — simple, clean

**Animation patterns:**
- Page transitions — fade in on route change
- Cart drawer — slide in from right
- Product cards — subtle hover lift
- Form steps — slide left/right between checkout steps

---

## 8. Database Seed

A seed file must be generated at `server/prisma/seed.ts` and run automatically after migration.

**What to seed:**
- 20 products across 4 categories: `Electronics`, `Clothing`, `Books`, `Home`
- Each product must have a realistic name, description, price, stock, category, and a real image URL from `https://picsum.photos`

**Example product shape:**
```ts
{
  name: "Wireless Noise-Cancelling Headphones",
  description: "Premium over-ear headphones with 30hr battery life and active noise cancellation.",
  price: 149.99,
  stock: 40,
  category: "Electronics",
  imageUrl: "https://picsum.photos/seed/headphones/600/400"
}
```

**package.json script to register the seed:**
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Run with: `npx prisma db seed`

---

## 9. Environment Variables

**Backend (`server/.env`):**
```
DATABASE_URL=mysql://user:password@localhost:3306/ecommerce
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```
VITE_API_URL=http://localhost:5000/api
```