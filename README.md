# Minakshi's Knowledge Dome

A full-stack web application for Minakshi Talathi's English teaching class in Pune, India. Built to help manage students, batches, attendance, and fees — with a public-facing landing page for prospective students and parents.

---

## What it does

**Public landing page** — visible to anyone without login:
- Hero section with enrollment CTA
- Live class stats (active students, batches, average attendance)
- Program listings with schedule and seat availability
- About the teacher section with photo gallery
- Real parent testimonials
- Contact details and WhatsApp link

**Admin dashboard** — accessible only to Minakshi after login:
- Add, view, edit, and deactivate students
- Track fee status (Paid / Pending / Overdue) with visual highlights
- Monitor attendance per student (last 20 classes as dots + overall percentage bar)
- Manage batches across 5 program types
- Post and hide announcements that appear on the landing page

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
- **Tailwind CSS v4** — utility-first styling with custom brand colors
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

---

## Contact

**Minakshi's Knowledge Dome** · Pune, Maharashtra, India  
Phone: +91 96045 55029  
Email: minakshisknowledgedome@gmail.com  
Instagram: [@knowledgedome](https://www.instagram.com/knowledgedome/)
