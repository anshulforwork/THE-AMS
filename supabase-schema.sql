-- AMS Life — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → Run. That's it.

create table if not exists ams_daily_log (
  date text primary key,
  day text,
  learn_hrs numeric default 0,
  course text,
  expense numeric default 0,
  category text,
  mood numeric default 0,
  productivity numeric default 0,
  exercise boolean default false,
  journal_done boolean default false,
  key_learning text,
  journal_text text,
  checkin_timestamp text
);

create table if not exists ams_setup (
  key text primary key,
  value text
);

create table if not exists ams_courses (
  id text primary key,
  quarter text, track text, title text, url text,
  start text, "end" text, course_hrs numeric default 0,
  progress_pct numeric default 0, status text default 'Not Started', skill text, roi text
);

create table if not exists ams_skills (
  id text primary key,
  skill text, target_level text, current_pct numeric default 0,
  target_q text, self_rating numeric default 0
);

create table if not exists ams_milestones (
  id text primary key,
  month text, deliverable text, type text, status text default 'pending',
  idx_link text, notes text
);

create table if not exists ams_reading (
  id text primary key,
  book text, author text, total_pg numeric default 0,
  target_pg_wk numeric default 0, pages_read numeric default 0
);

create table if not exists ams_finance_plan (
  key text primary key,
  value text, notes text
);

create table if not exists ams_network (
  id text primary key,
  name text, relationship text, company text, role text, contact text,
  last_contacted date, next_followup date, importance text default 'medium', notes text
);

create table if not exists ams_habits (
  id text primary key,
  name text, icon text, color text, cadence text default 'daily',
  created_at text, archived boolean default false
);

create table if not exists ams_habit_logs (
  habit_id text,
  date text,
  primary key (habit_id, date)
);

create table if not exists ams_goals (
  id text primary key,
  title text, category text, target numeric default 0, current numeric default 0,
  unit text, deadline date, status text default 'active', notes text
);

create table if not exists ams_budgets (
  id text primary key,
  category text, budget numeric default 0
);
