# AGENTS.md

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Turbopack dev server on `localhost:3000` |
| `npm run build` | Production build (validates types + lint implicitly) |
| `npm run lint` | ESLint (flat config, `eslint-config-next` v16) |
| `npx tsc --noEmit` | Standalone type-check — run this explicitly; `build` may not catch all |

No test framework is configured. There are no test scripts.

## Architecture

- **App Router** with two route groups: `(auth)` for `/login`, `/register`; `(dashboard)` for everything else. Route groups are URL-transparent — they exist only to split layouts.
- **`proxy.ts`** at the project root is the Next.js 16 Edge Proxy (replaces `middleware.ts`). It enforces auth via the `auth_token` cookie. Do **not** create a `middleware.ts` — it will be ignored.
- **`components/Providers.tsx`** is the Redux `'use client'` boundary wrapping the entire app in `app/layout.tsx`.
- **`features/`** holds Redux slices (`authSlice`, `filterSlice`) and the RTK Query API slice (`dummyJsonApi`). **`lib/`** holds the store config and typed hooks (`useAppDispatch`, `useAppSelector`).
- All data comes from the external DummyJSON REST API — there is no local backend.

## Conventions

- **Path alias**: `@/*` maps to the project root (e.g. `@/components/Button`).
- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin, **not** the legacy `tailwindcss` PostCSS plugin. Config is in `postcss.config.mjs`.
- **Dark-mode-first**: the `<html>` tag has `class="dark"`. All styling assumes dark background (`bg-slate-950`).
- **TypeScript strict mode** is enabled. Avoid `any`; use the typed Redux hooks from `lib/hooks.ts`.
- **Next.js `<Image>`** requires remote patterns configured in `next.config.ts`. Currently allows `cdn.dummyjson.com`, `dummyjson.com`, and `i.dummyjson.com`.
- Dynamic route params (`/products/[id]`) use `await params` — the Next.js 16 Promise-based API.

## Gotchas

- `npm run lint` is just `eslint` with no args — it relies on the flat config in `eslint.config.mjs`. Running `next lint` directly may not pick up the same config.
- The proxy cookie name is `auth_token` (hardcoded in `proxy.ts` and `utils/tokenStorage.ts`). Changing one without the other breaks auth.
- `npm run build` produces a `.next/` directory. Do not commit it.
