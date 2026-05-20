-- MTAI CLAW Requirements Portal — Supabase Schema
-- Run this in the Supabase SQL editor before deploying

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sessions table
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  session_label text not null,
  facilitator_name text not null
);

-- Responses table (one row per field, upserted on change)
create table if not exists responses (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  department text not null check (department in ('hr', 'delivery', 'sales')),
  section text not null,
  field_key text not null,
  field_value text not null default '',
  updated_at timestamptz not null default now(),
  unique (session_id, department, section, field_key)
);

-- Submissions table (one row per department per session)
create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  department text not null check (department in ('hr', 'delivery', 'sales')),
  submitted_at timestamptz not null default now(),
  submitted_by text not null,
  unique (session_id, department)
);

-- Indexes for common query patterns
create index if not exists responses_session_dept on responses(session_id, department);
create index if not exists submissions_session on submissions(session_id);

-- Row Level Security
alter table sessions enable row level security;
alter table responses enable row level security;
alter table submissions enable row level security;

-- Allow service role (server-side) full access — client never touches these tables directly
-- All client access goes through API routes using the service role key

-- RLS policies: deny all by default (service role bypasses RLS)
create policy "No direct client access to sessions"
  on sessions for all to anon, authenticated using (false);

create policy "No direct client access to responses"
  on responses for all to anon, authenticated using (false);

create policy "No direct client access to submissions"
  on submissions for all to anon, authenticated using (false);
