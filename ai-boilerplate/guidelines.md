# Engineering Guidelines & Constraints

These rules apply to every file generated in this project, without exception.

---

## Language & Runtime

- TypeScript everywhere — frontend and backend, no plain `.js` files
- Node.js 20+ with Express on the backend
- React 18+ with Vite on the frontend
- MySQL as the database, accessed via Prisma ORM
- `strict: true` in `tsconfig.json` — no exceptions
- No `any` types, ever. Use `unknown` and narrow it if needed

---

## Folder Structure

### Backend
```
server/
  src/
    controllers/      ← request/response handling only
    services/         ← all business logic lives here
    routes/           ← route definitions, middleware applied here
    middlewares/      ← auth, error handler, validators
    models/           ← Prisma schema and generated client
    utils/            ← shared helpers (jwt, hash, etc.)
    types/            ← shared TypeScript interfaces and types
    app.ts            ← express app setup
    server.ts         ← entry point, starts the server
```

### Frontend
```
client/
  src/
    components/       ← reusable UI components
    pages/            ← page-level components (one per route)
    hooks/            ← custom React hooks
    store/            ← Zustand global state
    services/         ← API call functions (axios)
    types/            ← shared TypeScript interfaces
    utils/            ← shared helpers
    App.tsx
    main.tsx
```

---

## Naming Conventions

- **Files**: `kebab-case` everywhere — `auth.controller.ts`, `product.service.ts`
- **Variables & functions**: `camelCase`
- **Types & Interfaces**: `PascalCase` — `UserPayload`, `ProductResponse`
- **Constants**: `UPPER_SNAKE_CASE` — `JWT_SECRET`, `MAX_CART_ITEMS`
- **React components**: `PascalCase` filename and function name — `ProductCard.tsx`
- **Database models**: `PascalCase` in Prisma schema — `model User`, `model Order`

---

## Error Handling

- Every controller wraps its logic in `try/catch`
- Caught errors are passed to `next(error)` — never respond inline with error details
- A single global error middleware in `middlewares/error.middleware.ts` handles all errors
- Define a custom `AppError` class extending `Error` with `statusCode` and `message`
- HTTP status codes must be semantically correct:
  - `400` — bad request / validation failure
  - `401` — unauthenticated
  - `403` — unauthorized (authenticated but forbidden)
  - `404` — not found
  - `500` — unexpected server error

```ts
// AppError usage
throw new AppError("Product not found", 404)
```

---

## API Response Format

Return data directly — no wrapper objects:

```ts
// correct
res.status(200).json(user)
res.status(201).json(product)
res.status(200).json(orders)

// wrong — do not wrap
res.status(200).json({ data: user, status: "ok" })
```

For deletions or actions with no return value:
```ts
res.status(200).json({ message: "Deleted successfully" })
```

---

## Controllers

- Controllers handle only: parsing request, calling a service, sending response
- No business logic inside controllers
- Always `async`, always `try/catch`, always pass errors to `next`

```ts
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}
```

---

## Services

- All business logic lives in services
- Services are plain async functions — no Express types (`Request`, `Response`) inside them
- Services throw `AppError` when something goes wrong
- Services return typed data, never raw Prisma objects if reshaping is needed

---

## Routes

- Each domain has its own router file in `routes/`
- Middleware (auth, validation) is applied at the route level, not inside controllers
- All routes are registered in `app.ts` under a versioned prefix `/api`

```ts
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
```

---

## Authentication

- JWT-based authentication
- Access token stored in `httpOnly` cookie or `Authorization` header
- `authMiddleware` validates the token and attaches `req.user` (typed)
- Passwords hashed with `bcrypt`, minimum 10 salt rounds
- Never return password hash in any response

---

## Database

- Prisma is the only way to interact with the database — no raw SQL
- All Prisma calls happen inside services, never in controllers or routes
- Schema file: `server/prisma/schema.prisma`
- Run migrations with `prisma migrate dev`, never manually alter tables

---

## Frontend State

- Zustand for global state (cart, auth/user session)
- Server state (products, orders) fetched with TanStack Query
- No prop drilling beyond one level — use hooks or store

---

## Code Style

- No unused imports, variables, or functions
- No commented-out code in final output
- `async/await` everywhere — no `.then()` chains
- Explicit return types on all functions
- No magic numbers — extract to named constants