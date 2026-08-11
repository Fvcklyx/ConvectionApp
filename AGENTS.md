# AGENTS.md

FRNDLY: internal web app (Laravel + React) to manage a garment/convection business. PO + custom-production model, no inventory/stock.

## Repository layout

- `backend/` — Laravel 13 REST API (no Blade views; all rendering is the React SPA).
- `frontend/` — React 19 + Vite SPA. Plain CSS (no Tailwind, no router, no state library despite `ai/project-context.md` mentioning them). `src/components/pages/` has one page component per module.
- `docs/` and `ai/` — Indonesian-language specs. `ai/master-rules.md`, `ai/coding-rules.md`, `ai/project-context.md` are the canonical dev rules; `AGENT.md` has the generic engineering rules. These docs drift from code (e.g. backend README module list is stale — shipments/reviews/testimonials/settings/reports are implemented too). Trust executable code over prose.

## Commands

```bash
# backend (from backend/)
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed      # demo login: admin@frndly.test / password123
php artisan serve               # http://127.0.0.1:8000
php artisan test                # runs Unit + Feature; sqlite :memory: per phpunit.xml — no MySQL needed
php artisan test --filter=BusinessRulesTest
vendor/bin/pint                 # formatter (installed, no pint.json config)

# frontend (from frontend/)
npm install
npm run dev                     # http://localhost:5173; proxies /api and /storage to :8000
npm run build
npm run lint                    # oxlint (NOT eslint)
npm run preview
```

- Frontend has **no test script and no typecheck**. Backend tests are the verification gate.
- No CI, no pre-commit hooks, no task runner config.

## Architecture notes (not obvious from filenames)

- API prefix `/api/v1`, Sanctum Bearer tokens. Public: `/auth/login` (throttled 5/min), `/company/profile`, `/health`. Everything else requires auth. Responses use the `{success, message, data}` envelope.
- Service layer is thin in practice: only `backend/app/Services/CodeGeneratorService.php`. Business logic lives in `backend/app/Http/Controllers/Api/` (thin-controller rules are aspirational). Follow existing code.
- Business codes (`ORD-`/`INV-`/`CUS-`/`PRD-YYYYMMDD-000`) are generated **server-side** by `CodeGeneratorService` via the `code_counters` table (`lockForUpdate`, per-day reset, concurrency-safe). Never generate them client-side or in migrations.
- Most models carry `company_id`; creating a record requires the frontend to send `company_id` (it holds it from `/settings/company`).
- Frontend has no router: `src/App.jsx` switches sections via `activeSection` state. On load it fetches **all** collections into React state (`loadAll`); pages read in-memory rows and call `refresh()` to refetch a section. List pages are therefore not paginated client-side and search is client-side (`src/lib/search.js`).
- `src/api.js` auto-attaches the token and logs out on 401 or 2 consecutive network failures (session guard in `src/lib/session.js`).

## Business rules (never invent values)

- Order statuses: `draft → waiting_dp → dp_received → processing → paid`. Invoice: `draft → issued → paid`. Payment types: `dp` (exactly once) and `final`. Backend is the sole source of truth for all money math (frontend only previews).
- Order items store price/name snapshots — master product price changes must never alter historical orders.
- Do not invent prices, discounts, DP, shipping cost, or profit numbers; they come from admin config. Do not add a payment gateway, external notifications, or any deferred feature (customer portal, roles/multi-admin, multi-tenant, mobile app, landing page, inventory) without explicit approval.

## Conventions

- Source code in English; project docs in Bahasa Indonesia; explain work to the owner in Bahasa Indonesia.
- DB changes must be migrations; destructive commands (`migrate:fresh`) need a warning. Update `docs/10-Changelog.md` for significant changes.
- Commits use `feat:`/`fix:`/`refactor:`/`test:`/`docs:`/`chore:` prefixes, one purpose each.
- `CONTEXT.md` is loaded as opencode instructions; `.opencode/` holds repo-local opencode skills/config.
