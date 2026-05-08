# Knowledge Dome

**Live demo:** [knowledge-dome-app.vercel.app](https://knowledge-dome-app.vercel.app)

A full-stack web application for an English teaching class in Pune, India. Built to help manage students, batches, attendance, and fees — with a public-facing landing page for prospective students and parents.

---

## What it does

**Public landing page** — visible to anyone without login:
- Hero section with enrollment CTA
- Live class stats (active students, batches, average attendance)
- Program listings in a card grid with schedule and seat availability
- About the teacher section with photo gallery
- Parent testimonials
- Contact details with WhatsApp and Instagram links
- Announcements section (pulled from the admin panel)

**Admin dashboard** — accessible only after login:
- Actionable overview: students with low attendance, fee issues, and today's attendance count
- Quick links to mark attendance, add students, and post announcements

**Students:**
- Add, view, edit, and deactivate students
- Fee status (Paid / Pending / Overdue) updatable directly from the student list — no need to open the edit form
- Attendance history shown as dots (last 20 classes) + overall percentage on the student profile
- WhatsApp and phone call buttons with confirmation dialogs before dialling
- Inactive students shown in a separate collapsible section

**Attendance:**
- Mark attendance per student per day with auto-save on tap
- Today / Yesterday quick buttons + custom date picker
- Filter by program type
- Students grouped by batch with per-group present count
- Summary tab showing all students sorted by attendance percentage (colour-coded: red below 75%, amber 75–90%, green 90%+)

**Batches:**
- Create and edit batches across 5 program types
- Seat count tracked automatically

**Announcements:**
- Post, edit, show, and hide announcements
- Active announcements appear on the public landing page automatically

---

## Programs offered

| Program | Audience |
|---|---|
| Academic Grammar | Kids, Grades 2–8 |
| Phonics for Kids | Kids |
| Phonics for Adults | Adults |
| Spoken English for Adults | Adults |
| Language Classes for Kids | Kids, Senior KG–Grade 4 |

---

## Tech stack

| Technology | Why we chose it |
|---|---|
| **Next.js 16 (App Router)** | Server Components let data fetching happen on the server — the browser never talks to the database directly. Server Actions replace a traditional REST API for mutations, keeping the codebase simpler. TypeScript catches bugs at compile time rather than in production. |
| **Supabase** | Managed PostgreSQL with built-in authentication and Row Level Security. No need to build auth from scratch or run a separate auth service. The free tier handles a class of ~200 students comfortably, and RLS policies enforce access control at the database level as a safety net independent of application code. |
| **Tailwind CSS v4** | Utility-first classes keep styling co-located with markup, which is faster to iterate on than separate CSS files. v4's `@theme {}` block in `globals.css` replaces the config file entirely, reducing boilerplate. |
| **react-hook-form + Zod** | react-hook-form has minimal re-renders and excellent TypeScript support. Zod schemas are defined once in `src/lib/validations.ts` and reused on both the client (for instant inline errors) and the server (in Server Actions), so validation logic is never duplicated. |
| **Vercel** | Zero-configuration deployment for Next.js. Every push to `main` triggers an automatic build and deployment. Environment variables are managed securely in the Vercel dashboard, never in source code. |

---

## Running locally

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```
4. Run the schema and seed files in your Supabase SQL Editor (`supabase/schema.sql` then `supabase/seed.sql`)
5. Create an admin user in the Supabase dashboard under Authentication → Users
6. Start the dev server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Public landing page (/)
│   ├── login/page.tsx            # Login page
│   └── (protected)/              # All routes behind auth middleware
│       ├── dashboard/page.tsx
│       ├── students/             # List, new, [id] detail, [id]/edit
│       ├── batches/page.tsx
│       ├── announcements/page.tsx
│       └── attendance/page.tsx
├── components/
│   ├── ui/                       # Reusable primitives (Button, Input, Modal…)
│   ├── layout/                   # Sidebar, MobileNav, TopBar
│   ├── landing/                  # Landing page sections
│   ├── students/                 # StudentTable, StudentCard, FeeStatusButton…
│   ├── batches/                  # BatchModal
│   ├── announcements/            # AnnouncementModal
│   └── attendance/               # AttendanceMarker, AttendanceSummary
├── lib/
│   ├── supabase/                 # Browser, server, and middleware clients
│   ├── constants.ts              # Class types, grades, fee statuses
│   ├── validations.ts            # Zod schemas shared across client and server
│   └── utils.ts                  # cn(), whatsappLink(), formatDate()…
└── types/database.ts             # TypeScript types for all DB tables

supabase/
├── schema.sql                    # Table definitions, RLS policies, triggers
└── seed.sql                      # Sample batches, students, announcements

e2e/                              # Playwright end-to-end tests
src/test/                         # Vitest unit and component tests
```

---

## Testing

The project has two layers of automated tests.

**Unit & component tests (Vitest)**
```bash
npm test
```
Covers utility functions (`getInitials`, `whatsappLink`, `formatCurrency`, `formatDate`), Zod validation schemas (student and batch forms), and interactive components (`FeeStatusButton`, `WhatsAppButton`, `InactiveStudentsSection`).

**End-to-end tests (Playwright)**
```bash
npm run e2e          # headless
npm run e2e:headed   # watch in browser
npx playwright test --ui  # interactive UI mode with step-by-step replay
```
Requires the dev server running (`npm run dev`) and a test user created in Supabase. Credentials are stored in `.env.test` (gitignored). Covers the login flow, adding a student, updating fee status, and marking attendance.

---

## Built with Claude Code

This project was built end-to-end using [Claude Code](https://claude.ai/code) — Anthropic's AI coding assistant — as a showcase of how AI-assisted development can produce a production-ready application with real security, validation, and test coverage.

Here is a concise walkthrough of how the project was created.

### 1. Planning and architecture
Claude Code started by producing a detailed build plan covering the database schema, file structure, component hierarchy, and data-flow architecture before a single line of code was written. Key decisions — such as keeping all Supabase calls in Server Components, mutations in Server Actions only, and Client Components used only for interactivity — were defined upfront and followed throughout.

### 2. Database design
The schema was designed in `supabase/schema.sql` with four tables (`batches`, `students`, `attendance_records`, `announcements`) and Row Level Security (RLS) policies to control access:
- `batches` and active `announcements` are publicly readable (for the landing page)
- All other tables require an authenticated session
- A trigger automatically keeps `batches.current_count` in sync

### 3. Authentication and route protection
A Next.js middleware file guards all protected routes (`/dashboard`, `/students`, `/batches`, `/attendance`, `/announcements`). Unauthenticated requests are redirected to `/login`. The admin account is created manually in the Supabase dashboard — there is no self-signup, which eliminates an entire class of unauthorised access.

### 4. Building features incrementally
Features were built one at a time in a deliberate order: shared UI components → layout → landing page → login → dashboard → students → attendance → batches → announcements. Each feature was tested in the browser before moving on.

### 5. Form validation
Every form uses a Zod schema defined in `src/lib/validations.ts`. Schemas are shared between the client-side react-hook-form resolver (for instant inline errors) and server-side validation in Server Actions, so invalid data is rejected at both layers.

### 6. Security practices
- **No credentials in source code** — Supabase URL and key are environment variables; `.env*` files are gitignored
- **Server Actions for all mutations** — the browser never calls the database directly
- **RLS policies** — enforced at the database level regardless of application logic
- **Confirmation dialogs** — WhatsApp and phone call buttons require an explicit confirmation before opening, preventing accidental dials
- **Error boundary** — a `error.tsx` file catches unexpected server errors on all protected routes

### 7. Code quality improvements
After the initial build, several improvements were made in response to review:
- Replaced `as any` casts with proper TypeScript types
- Standardised all mutations to use Server Actions with `revalidatePath()`
- Added loading skeletons for pages that fetch data
- Added an error boundary for the protected route group

### 8. Unit and component testing (Vitest)
A Vitest test suite was added covering:
- **Utility functions** — 16 tests across `getInitials`, `whatsappLink`, `formatCurrency`, `formatDate`
- **Zod schemas** — 15 tests verifying valid inputs pass and invalid inputs are rejected with the right messages
- **React components** — component tests for `FeeStatusButton`, `WhatsAppButton`, and `InactiveStudentsSection` using React Testing Library and `vi.mock` to stub server actions

### 9. End-to-end testing (Playwright)
A Playwright E2E suite was added with 11 tests across 3 spec files. Tests run sequentially (single worker) to avoid concurrent Supabase auth issues. Test credentials are stored in a gitignored `.env.test` file and loaded at runtime — no secrets are committed to the repository. The Playwright UI mode (`npx playwright test --ui`) provides a step-by-step visual replay of every action.

### 10. Deployment
The app is deployed to Vercel with environment variables set in the Vercel dashboard. Every push to `main` triggers an automatic deployment.
