-- Run this in the Supabase SQL Editor to add testimonials management

-- ─── TABLE ──────────────────────────────────────────────────────────────────

create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null default 'Parent',
  quote text not null,
  stars int not null default 5 check (stars between 1 and 5),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table testimonials enable row level security;

-- Anyone can read active testimonials (for the public landing page)
create policy "Public can read active testimonials"
  on testimonials for select
  using (is_active = true);

-- Authenticated admin can do everything
create policy "Authenticated can manage testimonials"
  on testimonials for all
  using (auth.role() = 'authenticated');

-- Required so the anon key can read the table at all
grant select on testimonials to anon;
grant all on testimonials to authenticated;

-- ─── SEED (existing hardcoded testimonials) ──────────────────────────────────

insert into testimonials (name, role, quote, stars, is_active) values
(
  'Saili Karandikar Tambe', 'Parent',
  'My son recently completed Level-1 Phonics from Minakshi''s Knowledge Dome. I am grateful for Ma''am''s efforts on my son as a Semi-English medium student. He loved attending classes. Very happy and satisfied — she arranges special programs as required by each student.',
  5, true
),
(
  'Mrs. Thombare', 'Parent',
  'If you are looking for the best class, Minakshi''s Knowledge Dome is it. Ma''am''s teaching skills are amazing and very innovative. My son enjoyed each and every session and it helped him upgrade his skills. Ma''am focused on grammar and communication skills. Thank you so much for everything!',
  5, true
),
(
  'Mr. Atul Kothari', 'Parent',
  'Kids really enjoy it!! Your system of teaching is not only bookish but covers overall knowledge — kids don''t want to miss the class. Thanks!',
  5, true
),
(
  'Mrs. Phadnis', 'Parent',
  'My kid showed a lot of improvement after joining Minakshi''s Knowledge Dome. She is very happy to go for her classes. Ma''am is very patient and has great teaching skills. Would definitely recommend joining her class.',
  5, true
),
(
  'Seema Purohit', 'Parent',
  'Awesome learning, confidence building & grooming of language from every aspect — that''s Minakshi''s Knowledge Dome. Lovely place to learn.',
  5, true
);
