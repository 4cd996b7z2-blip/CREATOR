-- Rajkot Creators: database schema.
-- Paste this whole file into Supabase -> SQL Editor -> New query -> Run.
-- Safe to run more than once.

create table if not exists public.creators (
  id             uuid primary key default gen_random_uuid(),
  handle         text not null,                       -- instagram username, lowercase, also the login username
  password_hash  text not null,                       -- bcrypt hash, never the password
  instagram_url  text not null,
  display_name   text not null,
  city           text not null default 'Rajkot',
  niche          text,
  languages      text[] not null default '{}',
  audience       text,
  video_types    text[] not null default '{}',
  best_reel_url  text,
  ambition       text,
  deal_types     text[] not null default '{}',
  price_reel     integer check (price_reel is null or (price_reel >= 0 and price_reel <= 10000000)),
  followers      integer check (followers is null or followers >= 0),  -- set by admin when verifying
  status         text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verify_code    text not null,                       -- one-time code the creator DMs us on Instagram
  verified_at    timestamptz,
  failed_logins  integer not null default 0,
  locked_until   timestamptz,
  created_at     timestamptz not null default now()
);

create unique index if not exists creators_handle_key on public.creators (lower(handle));
create index if not exists creators_status_idx on public.creators (status, created_at desc);

create table if not exists public.enquiries (
  id                 uuid primary key default gen_random_uuid(),
  creator_id         uuid not null references public.creators (id) on delete cascade,
  contact_name       text not null,
  brand_name         text not null,
  phone              text not null,
  email              text,
  business_type      text,
  budget_band        text,
  message            text not null,
  status             text not null default 'new' check (status in ('new', 'contacted', 'booked', 'declined')),
  agreed_price       integer check (agreed_price is null or agreed_price >= 0),
  status_changed_at  timestamptz,
  ip_hash            text not null,                   -- hashed IP, used only for rate limiting
  created_at         timestamptz not null default now()
);

create index if not exists enquiries_creator_idx on public.enquiries (creator_id, created_at desc);
create index if not exists enquiries_ip_idx on public.enquiries (ip_hash, created_at desc);

-- Lock the tables down. The website talks to the database only from the server
-- with the service-role key (which bypasses RLS). With RLS on and no policies,
-- the public "anon" key can read and write nothing, so phone numbers and
-- password hashes cannot leak through the API.
alter table public.creators enable row level security;
alter table public.enquiries enable row level security;
revoke all on public.creators from anon, authenticated;
revoke all on public.enquiries from anon, authenticated;
