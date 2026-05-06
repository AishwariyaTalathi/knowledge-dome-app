@AGENTS.md

# Minakshi's Knowledge Dome

## Project Overview
A web app for Minakshi Talathi's English teaching class in Pune.
Single admin (Minakshi) manages students, batches, attendance, fees, and announcements.
Public landing page shows class info without login.

## Users
- **Admin**: Minakshi (non-technical). One account, no self-signup.
- **Public**: Students and parents browsing the landing page.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript, src/ directory)
- **Styling**: Tailwind CSS v4 — brand colors defined via `@theme` in `globals.css`, no `tailwind.config.ts`
- **Database**: Supabase (PostgreSQL + Auth)
- **Supabase client key**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not ANON_KEY)
- **Fonts**: Plus Jakarta Sans (body), Playfair Display (headings) via `next/font/google`
- **Brand color**: `#1565C0` mapped as `brand-800`
- **Forms**: react-hook-form + zod. Use `as Resolver<FormData>` cast for z.coerce fields

## Architecture Rules
- **Data fetching**: Always in Server Components (`page.tsx` files). They run on the server, fetch from Supabase, and pass data down as props. Never call Supabase from a `'use client'` component — that would mean the browser is hitting the database directly, which is slower and less secure.
- **Mutations** (create/update/delete): Use Server Actions only. Always call `revalidatePath()` afterwards so the page reflects the change.
- **Client Components** (`'use client'`): Only used for interactivity — forms, modals, filters, confirm dialogs, buttons that do something. They receive data as props from Server Components above them.
- **Protected routes**: `middleware.ts` guards `/dashboard`, `/students`, `/batches`, `/announcements`. Unauthenticated users are redirected to `/login`.
- **Public routes**: Only `/` (landing page) and `/login`. Supabase RLS lets anonymous users read `batches` and active `announcements` — everything else requires auth.
- **Images**: Stored in `public/images/` and `public/images/gallery/`. Always use `next/image` with local paths.

## Coding Style
- No comments unless the reason behind the code is genuinely non-obvious
- No unnecessary abstractions — solve the problem at hand, don't build for hypothetical future needs
- No error handling for things that can't happen — only validate at real boundaries (user input, external APIs)
- Keep responses short and direct. No trailing summaries of what was just done.

## Known Gotchas
- Supabase tables created via SQL Editor need explicit `GRANT` statements — RLS alone is not enough for anon/authenticated access
- Tailwind v4 does not use `tailwind.config.ts` — all custom tokens go in `globals.css` under `@theme {}`
- Next.js 16 `params` in dynamic routes is a Promise — always `await params` before destructuring
- `z.coerce.number()` with react-hook-form causes a resolver type error — fix with `zodResolver(schema) as Resolver<FormData>`
- The Supabase publishable key env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, not `NEXT_PUBLIC_SUPABASE_ANON_KEY`
