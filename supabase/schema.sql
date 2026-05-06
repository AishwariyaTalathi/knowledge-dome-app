-- Minakshi's Knowledge Dome — Database Schema
-- Run this in the Supabase SQL Editor before starting the app.

create extension if not exists "uuid-ossp";

-- ─── BATCHES ────────────────────────────────────────────────────────────────

create table batches (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  schedule      text not null,
  class_type    text not null check (class_type in (
                  'Academic Grammar',
                  'Phonics for Kids',
                  'Phonics for Adults',
                  'Spoken English for Adults',
                  'Language Classes for Kids'
                )),
  max_seats     int  not null default 20,
  current_count int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─── STUDENTS ───────────────────────────────────────────────────────────────

create table students (
  id              uuid primary key default uuid_generate_v4(),
  first_name      text    not null,
  last_name       text    not null,
  age             int,
  batch_id        uuid    references batches(id) on delete set null,
  grade           text,   -- e.g. "Grade 3", "Senior KG" — for kids programs only
  guardian_name   text,
  phone           text,
  email           text,
  whatsapp_number text,
  enrollment_date date    not null default current_date,
  is_active       boolean not null default true,
  attendance_pct  numeric(5,2) default 0,
  fee_status      text    not null default 'Pending'
                    check (fee_status in ('Paid', 'Pending', 'Overdue')),
  fee_amount      numeric(10,2),
  notes           text,
  created_at      timestamptz not null default now()
);

-- ─── ATTENDANCE RECORDS ─────────────────────────────────────────────────────

create table attendance_records (
  id          uuid    primary key default uuid_generate_v4(),
  student_id  uuid    not null references students(id) on delete cascade,
  class_date  date    not null,
  present     boolean not null,
  created_at  timestamptz not null default now(),
  unique(student_id, class_date)
);

-- ─── ANNOUNCEMENTS ──────────────────────────────────────────────────────────

create table announcements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  date        date not null default current_date,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── TRIGGER: keep batches.current_count in sync ───────────────────────────

create or replace function update_batch_count()
returns trigger language plpgsql as $$
declare
  target_batch_id uuid;
begin
  -- figure out which batch_id changed
  if TG_OP = 'DELETE' then
    target_batch_id := old.batch_id;
  elsif TG_OP = 'INSERT' then
    target_batch_id := new.batch_id;
  else
    -- UPDATE: handle both old and new batch if student was moved
    if old.batch_id is distinct from new.batch_id then
      update batches
        set current_count = (
          select count(*) from students
          where batch_id = old.batch_id and is_active = true
        )
      where id = old.batch_id;
    end if;
    target_batch_id := new.batch_id;
  end if;

  if target_batch_id is not null then
    update batches
      set current_count = (
        select count(*) from students
        where batch_id = target_batch_id and is_active = true
      )
    where id = target_batch_id;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger trg_update_batch_count
after insert or update or delete on students
for each row execute function update_batch_count();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

alter table batches            enable row level security;
alter table students           enable row level security;
alter table attendance_records enable row level security;
alter table announcements      enable row level security;

-- Public read: batches (for landing page)
create policy "public_read_batches"
  on batches for select using (true);

-- Public read: active announcements only (for landing page)
create policy "public_read_announcements"
  on announcements for select using (is_active = true);

-- Authenticated user: full access to all tables (single admin)
create policy "auth_all_batches"
  on batches for all using (auth.role() = 'authenticated');

create policy "auth_all_students"
  on students for all using (auth.role() = 'authenticated');

create policy "auth_all_attendance"
  on attendance_records for all using (auth.role() = 'authenticated');

create policy "auth_all_announcements"
  on announcements for all using (auth.role() = 'authenticated');

-- ─── TABLE-LEVEL GRANTS ─────────────────────────────────────────────────────
-- Required when tables are created via SQL (not Supabase dashboard)

grant usage on schema public to anon, authenticated;

grant select on batches            to anon, authenticated;
grant select on announcements      to anon, authenticated;

grant select, insert, update, delete on students           to authenticated;
grant select, insert, update, delete on attendance_records to authenticated;
grant select, insert, update, delete on batches            to authenticated;
grant select, insert, update, delete on announcements      to authenticated;