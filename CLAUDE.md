# CLAUDE.md — taxi-platform

## Ce este proiectul

Platformă de taxi modernă (BOLT-like), multi-city, cu obiectiv de scalare națională (România).
Monorepo npm cu suprafețele:

- `api/` — backend central (Express 5 + WebSocket, port 3001)
- `controlcenter/` — dispecerat (Next.js 15 Pages Router, port 3000)
- `user/`, `driver/` — **inexistente încă**; numele din `workspaces` sunt rezervate intenționat, NU le șterge
- `packages/shared/` — `@taxi/shared` — **single source of truth** pentru domain types, contracts, statuses, realtime events, topics
- `packages/tokens/` — `@taxi/tokens` — design tokens (Vanilla Extract, light/dark)

`landing` va fi un workspace separat, viitor — nu există acum.

## Starea reală (2026-07)

- `controlcenter` e matur vizual: login PIN (HQ + per-city), hartă live Mapbox per oraș, HUD, city switcher, client WS cu reconnect.
- `api` e funcțional ca demo realtime, dar **fără persistență**: comenzile sunt doar evenimente WS efemere — nu există DB, nu există `GET /orders`, refresh = totul pierdut. **Persistența decisă: Supabase** (neimplementată încă).
- `api/src/modules/drivers/` și `payments/` sunt stub-uri goale (`export {}`).
- Fleet directory: doar `baia-mare` are vehicule (250, sintetice); celelalte orașe au 0 → dispatch eșuează acolo.
- Typecheck trece curat pe toate workspace-urile. Nu există niciun test în repo.

### Known issues (fiecare are issue GitHub dedicat — repară-le DOAR prin issue-ul lor, nu en passant)

1. `controlcenter/pages/ops/[cityId]/orders.tsx` e copy-paste din `map.tsx` și randează harta; `components/ops/orders/OpsOrdersPage.tsx` (pagina reală de comenzi) e nemontată. → taxi-017 (#31)
2. **`api/.env.local` e comis în git — secretul HMAC și toate PIN-urile sunt COMPROMISE. De rotit înainte de orice deploy.** → taxi-001 (#15)
3. CI-ul din `controlcenter/.github/workflows/ci.yml` nu rulează niciodată (GitHub citește doar `.github/` de la root). → taxi-002 (#16)
4. `controlcenter/pages/api/fleet/[cityId].ts` citește `API_BASE_URL`; restul proxy-urilor citesc `TAXI_API_BASE_URL`. → taxi-005 (#19)
5. Duplicate de tipuri (a NU se extinde): `CityPublic` (api vs. controlcenter, dezaliniat — varianta din controlcenter nu are `mapCenter`/`mapZoom`), `ControlcenterTokenPayload` (api vs. controlcenter) → taxi-009 (#23); `packages/shared/src/contracts/orders.ts` (fictiv — API-ul real folosește alte nume de câmpuri: `service` nu `serviceType`) → taxi-008 (#22).

### Deprecated (nu construi peste ele)

- `controlcenter/pages/ops/map.tsx` și `ops/orders.tsx` (city-pickers legacy) — ruta canonică e `/ops/[cityId]/{map,orders}`
- `GET /dev/cities/:cityId` (fără auth) — folosește `GET /cities/:cityId` cu Bearer token

## Arhitectură și flux de date

```
browser → Next API proxies (controlcenter/pages/api/*) → Express :3001
                                                       → WS /ws?token=... → topic hub
```

- Auth: PIN (per oraș sau HQ) → `POST /auth/controlcenter/login` → token HMAC custom (nu JWT) cu scope `hq` | `city` → autorizare pe subscribe la topicuri WS.
- Topicuri: `city:` `order:` `driver:` `vehicle:` `controlcenter:` — registry-ul de evenimente permise per topic e în `api/src/modules/realtime/index.ts`.
- Prezența/locația vehiculelor: in-memory, TTL 60s, alimentate prin `PATCH /dev/vehicles/*`.
- Dispatch: nearest-vehicle (Haversine), sincron la `POST /orders`, fără acceptare de către șofer.
- Regulă: orice tip de domeniu, status, event sau contract nou se adaugă în `packages/shared`, niciodată local în api/controlcenter.

## Commands

```bash
# API: build first — dev runs dist/
npm -w api run build && npm run dev:api        # node api/dist/index.js on :3001
npm run dev:controlcenter                       # next dev on :3000

npm run typecheck                               # all workspaces (tsc --noEmit)
npm -w controlcenter run lint                   # ESLint
npm -w controlcenter run check:all              # format:check + typecheck + lint
npm -w packages/shared run build                # required before api build (dist consumed)
```

- Node 20.x (`controlcenter/.nvmrc`), npm workspaces (no pnpm/turbo).
- `scripts/*.ps1` (tree, fleet simulators) are **PowerShell-only** — they do not run on WSL without `pwsh`.
- Required env — api: `TAXI_AUTH_TOKEN_SECRET`, `TAXI_CONTROL_CENTER_HQ_PIN`, `TAXI_CONTROL_CENTER_HQ_CITY_ID`, `TAXI_CONTROL_CENTER_CITY_PINS_JSON`, optional `TAXI_AUTH_TOKEN_TTL_SEC`. Controlcenter: `NEXT_PUBLIC_MAPBOX_TOKEN`, `TAXI_API_BASE_URL`, `NEXT_PUBLIC_TAXI_WS_URL`.
- `controlcenter/.env.example` is stale (documents SEO/PWA keys, not the ones above).

## Code conventions (KonceptID)

- TypeScript strict, **no `any`**. Controlcenter additionally uses `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.
- **Vanilla Extract only** — styles live in `styles/*.css.ts`; **no inline styles**, no global CSS beyond `globals.css` / `theme.global.css`. Consume tokens from `@taxi/tokens`.
- **Relative imports** — no path aliases. Type imports inline (`import { type Foo }` — enforced by ESLint `consistent-type-imports`).
- Section comments pattern used across the codebase:
  ```ts
  // ==============================
  // Section name
  // ==============================
  ```
- Prettier: 100 cols, double quotes, semicolons, trailing commas. ESLint must be clean before commit.
- Package naming: `@taxi/*`. Validation style: hand-rolled narrow guards (`isObject`, `normalize*`) returning `null` on invalid — follow it, don't introduce a validation lib without discussion.
- Responses API: `{ ok: true, ... } | { ok: false, error: string }` — keep this shape.

## Git workflow

- Branch per issue, **squash & merge** into `main`. No direct commits to `main` for feature work.
- Commit format: `type(scope): description` — e.g. `feat(controlcenter): ...`, `chore(api): ...`.

## Interzis / Permis

**Interzis:**
- commit de `.env.local` sau secrete (istoricul e deja compromis — vezi Known issues #2)
- inline styles, CSS global nou, tipuri de domeniu în afara `@taxi/shared`
- dependențe noi semnificative fără discuție prealabilă
- reparat known issues sau șters rute deprecated fără să ți se ceară
- rulat scripturi `.ps1` din WSL

**Permis fără întrebat:** refactor local în fișierele pe care le atingi pentru task, aliniere la convențiile de mai sus, completare de tipuri lipsă în `@taxi/shared` când task-ul o cere.

## Roadmap

Ordinea de dezvoltare (decisă, fixă): **controlcenter → landing → user → driver → payments**.

Planul complet trăiește în **`ROADMAP.md`** (root): 7 faze + post-MVP, drum critic, matrice de dependențe, milestone-uri M1–M4. Backlog-ul integral: **45 issues GitHub deschise (#15–#59)**, mapare `#nr = taxi-XXX + 14` (taxi-044 = #58 Vercel/domeniu, taxi-045 = #59 admin panel), documentată în ROADMAP.md. Workflow-ul de execuție per issue (Prompt 1 analiză → aprobare → Prompt 2 execuție → PR → merge → update CLAUDE.md + ROADMAP.md): `docs/konceptid-taxi.md`.

**Milestone curent: M1 — Repo sigur + CI verde.** Puncte de intrare: taxi-001 (#15, rotire secrete) și taxi-002 (#16, CI la root).

În sesiunea de setup (2026-07-02) nu s-a modificat niciun cod — doar documentație (CLAUDE.md, docs/konceptid-taxi.md, ROADMAP.md) și deschiderea celor 45 de issues.

## Referințe

- `ROADMAP.md` — secvență, dependențe, milestone-uri (sursa de adevăr pentru ordinea de execuție)
- `docs/konceptid-taxi.md` — instrucțiuni KonceptID: workflow issues, format, convenții de colaborare
- `./briefing.sh` — snapshot de sesiune (git, env, scripts); generează `BRIEFING.md` (gitignored)
- `packages/tokens/src/theme.css.ts` — design tokens
- `api/src/modules/realtime/index.ts` — registry evenimente ↔ topicuri (de actualizat la orice event nou)
