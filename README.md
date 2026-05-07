# Knowledge Dome

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

- **Next.js 16** — App Router, TypeScript, Server Components, Server Actions
- **Supabase** — PostgreSQL database + authentication
- **Tailwind CSS v4** — utility-first styling with custom brand colors via `@theme` in `globals.css`
- **react-hook-form + zod** — form validation
- **Lucide React** — icons
- **Vercel** — hosting

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
