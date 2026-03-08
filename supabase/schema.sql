-- ============================================================
-- Notes App — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
-- Auto-populated from Google OAuth user metadata on sign-up.
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz default now() not null
);

-- ── 2. CATEGORIES ────────────────────────────────────────────
-- sort_order   → integer for manual drag-to-reorder.
--                Lower number = displayed first.
--                Increment by 1 per new category (client handles it).
-- created_at   → fallback sort when sort_order values are equal.
create table public.categories (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,
  icon       text        not null,
  sort_order integer     not null default 0,
  created_at timestamptz default now() not null
);

-- ── 3. NOTES ─────────────────────────────────────────────────
-- category_id is NULLABLE → NULL means "Uncategorized" (no DB row needed).
-- updated_at is kept in sync automatically via the trigger below.
create table public.notes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  category_id uuid        references public.categories(id) on delete set null,
  title       text        not null default 'Untitled',
  content     text        not null default '',
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ── 4. DAILY QUOTES ──────────────────────────────────────────
-- Single-row table for current daily quote from external API.
-- View-only for authenticated users. Updated via service role.
create table public.daily_quotes (
  id         uuid        primary key default gen_random_uuid(),
  quote      text        not null,
  author     text        not null default 'Unknown',
  updated_at timestamptz default now() not null,
  constraint single_quote_row check (id = id)
);

-- ── 5. INDEXES ───────────────────────────────────────────────
create index idx_categories_user_id  on public.categories(user_id);
create index idx_categories_sort     on public.categories(user_id, sort_order, created_at);
create index idx_notes_user_id       on public.notes(user_id);
create index idx_notes_category_id   on public.notes(category_id);
create index idx_notes_updated_at    on public.notes(user_id, updated_at desc);

-- ── 6. ROW LEVEL SECURITY (RLS) ──────────────────────────────
alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.notes        enable row level security;
alter table public.daily_quotes enable row level security;

-- Profiles
create policy "profiles: select own"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- Categories
create policy "categories: select own"
  on public.categories for select using (auth.uid() = user_id);

create policy "categories: insert own"
  on public.categories for insert with check (auth.uid() = user_id);

create policy "categories: update own"
  on public.categories for update using (auth.uid() = user_id);

create policy "categories: delete own"
  on public.categories for delete using (auth.uid() = user_id);

-- Notes
create policy "notes: select own"
  on public.notes for select using (auth.uid() = user_id);

create policy "notes: insert own"
  on public.notes for insert with check (auth.uid() = user_id);

create policy "notes: update own"
  on public.notes for update using (auth.uid() = user_id);

create policy "notes: delete own"
  on public.notes for delete using (auth.uid() = user_id);
Daily Quotes
-- Daily Quotes (view-only for users, managed via service role)
create policy "daily_quotes: select for authenticated"
  on public.daily_quotes for select to authenticated using (true);
-- ── 7
-- ── 6. TRIGGERS ──────────────────────────────────────────────

-- Auto-create a profile row when a new user signs up (e.g. via Google)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update notes.updated_at on every UPDATE
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute procedure public.handle_updated_at();
