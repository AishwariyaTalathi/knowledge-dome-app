-- Minakshi's Knowledge Dome — Seed Data
-- Run AFTER schema.sql. Replace UUIDs in the students section
-- with the actual batch UUIDs from your Supabase batches table.
-- Query: SELECT id, name FROM batches;

-- ─── BATCHES ────────────────────────────────────────────────────────────────

insert into batches (name, schedule, class_type, max_seats) values
  ('Academic Grammar – Morning',    'Mon/Wed/Fri 8:00 AM',  'Academic Grammar',          20),
  ('Phonics for Kids – Evening',    'Tue/Thu 5:30 PM',      'Phonics for Kids',          15),
  ('Phonics for Adults – Morning',  'Mon/Wed 10:00 AM',     'Phonics for Adults',        12),
  ('Spoken English – Afternoon',    'Tue/Thu/Sat 4:00 PM',  'Spoken English for Adults', 15),
  ('Language Class – Weekend',      'Sat/Sun 10:00 AM',     'Language Classes for Kids', 18);

-- ─── ANNOUNCEMENTS ──────────────────────────────────────────────────────────

insert into announcements (title, description, date, is_active) values
  (
    'Summer Batch Starting June 1',
    'New batches for all programs starting June 1st. Limited seats available. Contact Minakshi to enroll your child.',
    '2026-05-15',
    true
  ),
  (
    'Holiday on May 12',
    'No classes on account of Maharashtra Day. Classes resume normally from May 13.',
    '2026-05-04',
    true
  );

-- ─── STUDENTS ───────────────────────────────────────────────────────────────
-- After running this file, get batch UUIDs with: SELECT id, name FROM batches;
-- Then replace the WITH clauses below with your real UUIDs, or insert directly.

with batch_ids as (
  select id, name from batches
)
insert into students
  (first_name, last_name, age, batch_id, grade, guardian_name, phone, whatsapp_number,
   enrollment_date, fee_status, fee_amount, attendance_pct, notes)
select
  s.first_name, s.last_name, s.age,
  b.id as batch_id,
  s.grade, s.guardian_name, s.phone, s.whatsapp_number,
  s.enrollment_date::date, s.fee_status, s.fee_amount, s.attendance_pct, s.notes
from (values
  ('Priya',    'Sharma',   9,  'Academic Grammar – Morning',    'Grade 4', 'Rekha Sharma',    '9876543210', '9876543210', '2026-01-10', 'Paid',    800,  92.5, null),
  ('Arjun',    'Patil',    11, 'Academic Grammar – Morning',    'Grade 6', 'Sunil Patil',     '9823456789', '9823456789', '2026-02-01', 'Paid',    800,  85.0, 'Needs extra help with tenses'),
  ('Meera',    'Joshi',    7,  'Phonics for Kids – Evening',    null,      'Anita Joshi',     '9845678901', '9845678901', '2026-01-15', 'Pending', 600,  78.0, null),
  ('Rohan',    'Desai',    5,  'Language Class – Weekend',      'Senior KG', 'Kavita Desai',  '9867890123', '9867890123', '2026-03-01', 'Paid',    700,  95.0, 'Very enthusiastic'),
  ('Sunita',   'Kulkarni', 35, 'Phonics for Adults – Morning',  null,      null,              '9812345678', '9812345678', '2026-02-15', 'Overdue', 1000, 60.0, 'Missed several classes in March'),
  ('Rahul',    'Mehta',    28, 'Spoken English – Afternoon',    null,      null,              '9834567890', '9834567890', '2026-01-20', 'Paid',    1200, 88.0, null),
  ('Anjali',   'Rane',     8,  'Phonics for Kids – Evening',    null,      'Deepak Rane',     '9856789012', '9856789012', '2026-03-10', 'Pending', 600,  70.0, null),
  ('Vikram',   'Nair',     42, 'Spoken English – Afternoon',    null,      null,              '9878901234', '9878901234', '2026-02-01', 'Paid',    1200, 80.0, 'Corporate professional, prefers evening slots')
) as s(first_name, last_name, age, batch_name, grade, guardian_name, phone, whatsapp_number,
        enrollment_date, fee_status, fee_amount, attendance_pct, notes)
join batch_ids b on b.name = s.batch_name;