# helfy-task

AI-driven full stack eCommerce platform built as part of the Helfy engineering assignment. The objective was to design an "AI Blueprint" — a set of engineering guidelines, capability definitions, and a bootstrap prompt — that instructs an AI agent (Cline) to generate a production-grade application with minimal human intervention.

---

## Tech Stack

**Frontend**
- React 18 + Vite + TypeScript
- Tailwind CSS v3 + Framer Motion
- Zustand (client state) + TanStack Query (server state)
- React Router v6 + Axios

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + MySQL
- JWT authentication
- bcrypt password hashing

---

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL running locally

### Backend setup
```bash
cd server
npm install
# configure your .env (see .env.example)
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend setup
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

### Environment variables

**`server/.env`**
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/ecommerce"
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

---

## Features

- **Authentication** — register, login, logout with JWT
- **Product Catalog** — search, filter by category and price, pagination, 20 seeded products across 4 categories
- **Cart** — persistent cart, quantity controls, real-time total
- **Checkout** — 3-step flow: shipping → review → confirmation
- **Account** — profile management, password change, order history

---

## AI Boilerplate

The blueprint files used to generate this project are in `/ai-boilerplate`:

| File | Purpose |
|------|---------|
| `guidelines.md` | Engineering rules and conventions the AI must follow |
| `capabilities.md` | Module definitions, data shapes, API routes, UI components |
| `initial.md` | Bootstrap prompt that initiates the full project generation |

---

## Manual Interventions

The following required human intervention — these are the points where prompting was less efficient than a direct fix.

### 1. `server/tsconfig.json` — rootDir conflict
Cline set `rootDir: "src"` which caused a TypeScript error because `prisma/seed.ts` lives outside of `src/`. Fixed manually by removing `rootDir` and adding an explicit `include` array covering both locations.

**Why AI failed:** AI applied a standard tsconfig pattern without accounting for the non-standard seed file location outside `src/`.

### 2. Tailwind CSS v3/v4 syntax mismatch
Cline generated `index.css` using Tailwind v4 import syntax despite v3 being installed. Additionally generated a `postcss.config.ts` which caused a `ts-node not found` error.

Fixed manually by:
- Replacing `index.css` with correct v3 syntax
- Deleting `postcss.config.ts`
- Creating `postcss.config.js` with correct v3 PostCSS config

**Why AI failed:** AI assumed the latest Tailwind syntax without checking the actually installed version.

### 3. Missing `.gitignore`
`.gitignore` was not included in the initial prompt so it was not generated before the first commit. `node_modules` and `.env` were accidentally pushed to GitHub.

Fixed manually by running `git rm -r --cached` and committing a proper `.gitignore`.

**Why AI failed:** not instructed to create it — an oversight in the initial prompt.

### 4. Wrong file locations for `app.ts` and `server.ts`
Cline placed both files in `/server` root instead of `/server/src`. Flagged to Cline and corrected before continuing.

**Why AI failed:** ambiguity in the scaffold instructions — AI defaulted to root placement.

### 5. OpenRouter PII blocks (x2)
Cline hit 403 PII detection errors from OpenRouter at Steps 7 and 11, with auto-retry failing after 3 attempts each time. Resolved by creating a `.clineignore` file to exclude `.env` files from context and starting new Cline tasks with explicit step context.

**Why AI failed:** infrastructure limitation of the OpenRouter setup — not an AI capability gap.

---

## AI Interactions

Full log of all prompts, search queries, model choices, and decisions made during the session: see `ai-interactions.md`.