# AI Interactions Log

## Tools & Models Used
- **Cline** (VSCode extension) — main AI code generation agent
- **OpenRouter** — API provider for Cline
- **Claude Sonnet 4** — model used via Cline for all code generation
- **Claude.ai** — used for planning, blueprint creation, and troubleshooting

---

## Planning & Architecture Phase

### Blueprint creation (Claude.ai)
Used Claude.ai to design the full AI blueprint before touching any code.
Decisions made during planning:
- Layer-based folder structure (controllers, services, routes)
- Try/catch in controllers + global error middleware
- Return data directly, no wrapper objects
- JWT authentication with httpOnly cookies
- Prisma as ORM for MySQL
- Zustand for client state only, TanStack Query for all server state

Produced three files:
- `guidelines.md` — engineering rules and conventions
- `capabilities.md` — module definitions and data shapes
- `initial.md` — bootstrap prompt for Cline

---

## Cline Session Log

### Step 1 — Project scaffold
Cline confirmed it read all three files and listed all Step 1 placeholder files before writing. Approved.
Cline created folder structure and placeholder files for both `/server` and `/client`.
No issues.

---

### Step 2 — Configuration files
Cline generated `tsconfig.json`, `package.json`, and config files for both server and client.

**Manual intervention #1 — tsconfig.json rootDir conflict**
Cline set `rootDir: "src"` in `server/tsconfig.json` which caused a TypeScript error because `prisma/seed.ts` is outside of `src/`.

Fix applied manually:
- Removed `rootDir` from `compilerOptions`
- Added explicit `include: ["src/**/*", "prisma/seed.ts"]`

Reason for manual fix: faster than re-prompting, simple one-line config change.

---

### Step 3 — Database schema and seed
Cline generated Prisma schema with all models: User, Product, CartItem, Order, OrderItem.
Migration and seed ran successfully.
No issues.

---

### Steps 4–6 — Backend foundation, Auth, Product modules
Cline built AppError, error middleware, auth utilities, auth middleware, Express app setup, and all backend modules in order.
No issues.

---

### Step 7 — Cart module
**OpenRouter PII block — Session interrupted**
Cline hit a 403 PII detection error from OpenRouter mid-session and auto-retry failed after 3 attempts.
Started a new Cline task with explicit context about completed steps and added `.clineignore` to prevent `.env` files from being included in context.
Session resumed successfully from Step 7 and cart module was completed without issues.

---

### Steps 8–10 — Order module, Account module, Frontend foundation
Cline built all remaining backend modules and the full frontend foundation including Zustand stores, Axios instance, shared components, and React Router setup.
No issues.

---

### Step 11 — Frontend pages

**OpenRouter PII block — Session interrupted again**
Same 403 PII detection error hit again at the start of Step 11.
Started a new Cline task with context summary and resumed from Step 11 successfully.

**Manual intervention #2 — Tailwind CSS v3/v4 syntax mismatch**
Cline generated `index.css` using Tailwind v4 import syntax (`@import "tailwindcss"`) but the installed version was Tailwind v3.
Additionally, `postcss.config.js` was missing entirely, and a conflicting `postcss.config.ts` was present which caused a `ts-node` not found error.

Fix applied manually:
- Replaced `index.css` content with correct v3 syntax (`@tailwind base/components/utilities`)
- Deleted `postcss.config.ts`
- Created `postcss.config.js` with tailwindcss and autoprefixer plugins

Reason for manual fix: faster than re-prompting, straightforward file changes.

**Auth flow bugs fixed by Cline**
After login and register, two bugs were present:
- Error toast was shown despite a successful 201 response
- Page refreshed instead of navigating to "/"

Cline identified the issues in the mutation error handling and `useNavigate` placement and fixed both correctly without manual intervention.

---

### Post Step 11 — TanStack Query refactor
Identified that all API calls were going through Zustand state instead of being cached by TanStack Query.
Prompted Cline to refactor all services into a two-layer structure:

```
src/services/
  apiServices/      ← raw axios functions only
  react-query/      ← useQuery and useMutation hooks per domain
    cart/
    product/
    order/
    account/
```

Cline completed the full refactor cleanly with no issues. All filter combinations are now cached by TanStack Query — repeated requests with the same params hit the cache instead of the network.

---

## Manual Interventions Summary

| # | What | Why AI failed | Fixed by |
|---|------|--------------|----------|
| 1 | `tsconfig.json` rootDir conflict | AI set rootDir to src but seed.ts lives in prisma/ | Manual |
| 2 | Tailwind v3/v4 syntax mismatch + missing postcss config | AI used v4 syntax despite v3 being installed | Manual |
| 3 | `.gitignore` not created before first commit | Not included in initial prompt | Manual |
| 4 | `app.ts` and `server.ts` generated in wrong location | AI placed them in /server root instead of /server/src | Flagged to Cline, corrected |
| 5 | OpenRouter PII block (x2) | Cline included .env content in API context | New task + .clineignore |

---

## AI-Gap Analysis
The most efficient use of human intervention vs prompt tuning was:
- **Config file fixes** — faster to edit one line manually than explain the exact error to AI and wait for a re-generation
- **Tailwind setup** — the v3/v4 mismatch was environment-specific; AI had no way to know which version was actually installed without being told explicitly
- **PII blocks** — not an AI capability gap but an infrastructure limitation of the OpenRouter setup provided; solved by session management rather than prompt tuning

---

## Search Queries
- "prisma validate error P1012 mysql" — confirmed DATABASE_URL format requirement
- "tailwind v4 vs v3 postcss config difference" — confirmed correct postcss.config.js format for v3
- "openrouter PII detection 403" — investigated cause of repeated session blocks