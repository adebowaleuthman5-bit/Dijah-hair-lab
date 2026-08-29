-- ============================================================
-- DIJAH HAIR LAB — Full Database Schema (combined, run once)
--
-- This is all 10 migrations from supabase/migrations/ concatenated in
-- order into one script, for pasting directly into the Supabase SQL
-- Editor (Dashboard -> SQL Editor -> New query -> paste this whole file ->
-- Run). Equivalent to running 0001 through 0010 individually — use
-- whichever is more convenient. The individual files remain the source
-- of truth if you need to re-run or modify just one part later.
--
-- Safe to run top-to-bottom in a single execution; later sections depend
-- on tables/functions created earlier in this same file.
-- ============================================================

-- ============================================================
-- FILE: 0001_extensions_and_enums.sql
-- ============================================================
-- ============================================================
-- DIJAH HAIR LAB — Database Schema
-- Migration 001: Extensions & Enums
--
-- Written for Postgres via Supabase. Every enum and table here maps
-- directly to a TypeScript interface in src/types/index.ts — see the
-- comment above each table for which interface it replaces. Keeping
-- these in lockstep means the frontend types and the database schema
-- never drift apart silently.
-- ============================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- Service / style taxonomy — matches ServiceCategory in types/index.ts
create type service_category as enum (
  'hair-weaving',
  'womens-styling',
  'mens-styling',
  'dreadlocking',
  'home-service',
  'custom-styling'
);

-- Matches StyleGender
create type style_gender as enum ('women', 'men', 'unisex');

-- Matches BookingLocationType
create type booking_location_type as enum ('in-shop', 'home-service');

-- Matches BookingStatus
create type booking_status as enum (
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show'
);

-- Matches PaymentStatus
create type payment_status as enum ('pending', 'successful', 'failed', 'refunded');

-- Matches AdminRole
create type admin_role as enum ('super-admin', 'manager', 'booking-manager', 'content-manager');

-- Matches Review['status']
create type review_status as enum ('pending', 'approved', 'rejected');

-- Matches CommunityPostType
create type community_post_type as enum ('announcement', 'beauty-tip', 'offer', 'featured-style');

-- Matches NotificationType
create type notification_type as enum ('booking', 'promo', 'system');

-- Matches CustomerDirectoryEntry['status'] / general active-inactive toggles
create type account_status as enum ('active', 'deactivated');


-- ============================================================
-- FILE: 0002_business_and_catalog.sql
-- ============================================================
-- ============================================================
-- Migration 002: Business settings, catalog (services/styles/categories),
-- and content tables (gallery, faqs, testimonials, community, newsletter)
-- ============================================================

-- Singleton row holding site-wide config. Matches BusinessSettings.
-- Enforced as a single row via the check constraint on `singleton`.
create table business_settings (
  singleton boolean primary key default true check (singleton),
  business_name text not null default 'DIJAH HAIR LAB',
  tagline text not null default 'WHERE DESIRE MEET PERFECTION',
  address_line text not null default 'Agungi',
  city text not null default 'Ajah',
  state text not null default 'Lagos State',
  country text not null default 'Nigeria',
  whatsapp_number text not null default '07036518121',
  tiktok_handle text not null default 'omobolanle',
  instagram_handle text,
  facebook_handle text,
  contact_email text,
  seo_title text,
  seo_description text,
  notify_on_new_booking boolean not null default true,
  notify_on_new_subscriber boolean not null default true,
  home_service_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into business_settings (singleton) values (true);

-- Matches BusinessHours[] on BusinessSettings — kept as its own table
-- rather than a JSON column so admin can query/edit per-day easily.
create table business_hours (
  day text primary key check (day in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  open_time text,
  close_time text,
  closed boolean not null default false
);

-- Admin-configurable booking rules. Matches AvailabilitySettings.
create table availability_settings (
  singleton boolean primary key default true check (singleton),
  opening_time text not null default '9:00 AM',
  closing_time text not null default '5:00 PM',
  working_days text[] not null default array['Mon','Tue','Wed','Thu','Fri','Sat'],
  break_start text,
  break_end text,
  appointment_duration_minutes int not null default 60,
  max_bookings_per_slot int not null default 1,
  blocked_dates date[] not null default '{}',
  holiday_dates date[] not null default '{}',
  home_service_available boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into availability_settings (singleton) values (true);

-- Matches AdminCategory
-- id/slug use readable text ids (matching the existing frontend demo data
-- like 'svc-hair-weaving') rather than uuids — these are a small,
-- admin-curated set, not user-generated at scale, so human-readable ids
-- make seeding and debugging easier. Bookings/customers/etc. below use
-- uuid since those are generated per-transaction with no natural slug.
create table categories (
  id text primary key,
  slug service_category not null unique,
  label text not null,
  description text not null default '',
  image text,
  sort_order int not null default 0,
  active boolean not null default true
);

-- Matches Service
create table services (
  id text primary key,
  name text not null,
  category service_category not null,
  description text not null default '',
  image text,
  duration_minutes int,
  price_from numeric(10, 2), -- null => "Contact us for pricing"
  home_service_available boolean not null default true,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Matches Style
create table styles (
  id text primary key,
  name text not null,
  service_id text not null references services (id) on delete cascade,
  category service_category not null,
  gender style_gender not null default 'unisex',
  description text not null default '',
  images text[] not null default '{}',
  duration_minutes int,
  price_from numeric(10, 2),
  rating numeric(2, 1) not null default 5.0 check (rating >= 0 and rating <= 5),
  review_count int not null default 0,
  is_new_arrival boolean not null default false,
  is_popular boolean not null default false,
  is_featured boolean not null default false,
  bookable boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_styles_service_id on styles (service_id);
create index idx_styles_category on styles (category);

-- Matches GalleryImage
create table gallery_images (
  id text primary key,
  url text not null,
  caption text,
  category service_category,
  featured boolean not null default false,
  visible_on_home boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Matches FAQItem
create table faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

-- Matches Testimonial — curated marketing copy (distinct from `reviews`,
-- which are customer-submitted and tied to a booking).
create table testimonials (
  id text primary key,
  customer_name text not null,
  location text,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  review text not null,
  service text,
  occurred_on date not null default current_date,
  photo text,
  is_demo boolean not null default false,
  approved boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Matches NewsletterSubscriber
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  joined_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'unsubscribed'))
);

-- Matches CommunityPost
create table community_posts (
  id text primary key,
  type community_post_type not null,
  title text not null,
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);


-- ============================================================
-- FILE: 0003_people_and_bookings.sql
-- ============================================================
-- ============================================================
-- Migration 003: Customers, bookings, reviews, payments, admin users
-- ============================================================

-- Matches Customer. id is the same uuid as auth.users.id — a customer
-- account IS a Supabase Auth user, with this row holding profile data.
create table customers (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text not null,
  registered_at timestamptz not null default now(),
  status account_status not null default 'active'
);

-- Matches SavedAddress
create table saved_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  label text not null,
  full_address text not null,
  area text not null,
  landmark text,
  is_default boolean not null default false
);

create index idx_saved_addresses_customer_id on saved_addresses (customer_id);

-- Matches CustomerNotification
create table customer_notifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create index idx_customer_notifications_customer_id on customer_notifications (customer_id);

-- Matches Booking + BookingCustomerDetails + HomeServiceDetails flattened
-- into one row. customer_id is nullable to support guest checkout (the
-- brief's booking flow doesn't require an account) — customer_* columns
-- always hold the details entered at booking time, regardless of whether
-- customer_id is set, so a booking's record of who it was for never
-- changes even if the linked account is later edited or deleted.
create table bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_id uuid references customers (id) on delete set null,
  customer_full_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_address text,
  special_request text,
  reference_image_url text,
  service_id text not null references services (id),
  style_id text references styles (id),
  location_type booking_location_type not null,
  home_full_address text,
  home_area text,
  home_landmark text,
  home_instructions text,
  booking_date date not null,
  booking_time text not null,
  estimated_cost numeric(10, 2),
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint home_service_requires_address check (
    location_type = 'in-shop' or (home_full_address is not null and home_area is not null)
  )
);

create index idx_bookings_customer_id on bookings (customer_id);
create index idx_bookings_customer_email on bookings (customer_email);
create index idx_bookings_date on bookings (booking_date);
create index idx_bookings_status on bookings (status);

-- Matches Review — customer-submitted, tied to a completed booking,
-- moderated by admin. Distinct from `testimonials` (curated copy).
create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings (id) on delete set null,
  customer_name text not null,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  review text not null,
  service text,
  review_date date not null default current_date,
  verified boolean not null default false,
  status review_status not null default 'pending',
  visible boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_reviews_booking_id on reviews (booking_id);
create index idx_reviews_status on reviews (status);

-- Matches PaymentRecord
create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  amount numeric(10, 2),
  method text,
  status payment_status not null default 'pending',
  payment_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_payments_booking_id on payments (booking_id);
create index idx_payments_status on payments (status);

-- Matches AdminUser. Like customers, an admin IS a Supabase Auth user;
-- this row holds their role and dashboard-specific profile data.
create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role admin_role not null default 'content-manager',
  active boolean not null default true,
  last_login timestamptz
);


-- ============================================================
-- FILE: 0004_triggers_and_views.sql
-- ============================================================
-- ============================================================
-- Migration 004: Triggers & views
-- ============================================================

-- Generic updated_at bump, used on the two singleton settings tables.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_business_settings_updated_at
  before update on business_settings
  for each row execute function set_updated_at();

create trigger trg_availability_settings_updated_at
  before update on availability_settings
  for each row execute function set_updated_at();

-- Auto-generates a booking reference like "DHL-7F3K2Q" on insert if the
-- app doesn't supply one — mirrors utils/format.ts's
-- generateBookingReference() so behavior stays identical whether the
-- reference is built client-side or here.
create or replace function generate_booking_reference()
returns trigger language plpgsql as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'DHL-' || upper(substring(md5(random()::text) from 1 for 6));
  end if;
  return new;
end;
$$;

create trigger trg_bookings_reference
  before insert on bookings
  for each row execute function generate_booking_reference();

-- Customer directory view — mirrors what src/hooks/useAdminOps.tsx
-- currently computes client-side from the bookings list (grouping by
-- email, counting bookings, tracking last booking date). Doing this in
-- SQL means the admin dashboard can query one view instead of pulling
-- every booking row and aggregating in JavaScript.
-- security_invoker = on makes this view run with the QUERYING user's
-- permissions instead of the view creator's — without it, Postgres views
-- default to running as their owner, which can silently bypass the RLS
-- policies on the tables they read from (bookings, customers here).
-- With it on: a customer querying this view only ever sees rows their
-- own RLS policies on bookings/customers would let them see anyway;
-- is_admin() in those same policies is what lets admins see everyone.
create view customer_directory
with (security_invoker = on)
as
select
  coalesce(c.id::text, lower(b.customer_email)) as directory_id,
  b.customer_email as email,
  max(b.customer_full_name) as full_name,
  max(b.customer_phone) as phone,
  c.id as customer_id,
  c.registered_at,
  coalesce(c.status, 'active') as status,
  count(b.id) as total_bookings,
  max(b.booking_date) as last_booking_date
from bookings b
left join customers c on c.email = b.customer_email
group by c.id, c.registered_at, c.status, b.customer_email;


-- ============================================================
-- FILE: 0005_auth_functions.sql
-- ============================================================
-- ============================================================
-- Migration 005: Auth helper functions
--
-- security definer lets these functions read admin_users even though
-- the calling user's own RLS policy on admin_users wouldn't otherwise
-- let them see other people's rows — without this, checking "am I an
-- admin?" would require a policy that recursively depends on itself.
-- ============================================================

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users where id = auth.uid() and active = true
  );
$$;

create or replace function is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users
    where id = auth.uid() and active = true and role = 'super-admin'
  );
$$;

-- True if the current user is an active customer account (not just any
-- authenticated user — e.g. an admin account without a customers row).
create or replace function is_active_customer()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from customers where id = auth.uid() and status = 'active'
  );
$$;


-- ============================================================
-- FILE: 0006_rls_public_content.sql
-- ============================================================
-- ============================================================
-- Migration 006: Row Level Security — public catalog & content
--
-- Pattern used throughout: "anyone can read published/active rows",
-- "only admins can write". This replaces what the current frontend only
-- enforces by hiding buttons — with RLS on, calling the write endpoint
-- directly (e.g. from browser dev tools) as a non-admin fails at the
-- database, not just in the UI.
-- ============================================================

alter table business_settings enable row level security;
alter table business_hours enable row level security;
alter table availability_settings enable row level security;
alter table categories enable row level security;
alter table services enable row level security;
alter table styles enable row level security;
alter table gallery_images enable row level security;
alter table faqs enable row level security;
alter table testimonials enable row level security;
alter table newsletter_subscribers enable row level security;
alter table community_posts enable row level security;

-- business_settings: public read (site needs it to render), admin update.
-- No insert/delete — it's a pre-seeded singleton row.
create policy "business_settings_public_read" on business_settings
  for select using (true);
create policy "business_settings_admin_update" on business_settings
  for update using (is_admin());

create policy "business_hours_public_read" on business_hours
  for select using (true);
create policy "business_hours_admin_write" on business_hours
  for all using (is_admin()) with check (is_admin());

-- availability_settings: public read (booking calendar needs the rules),
-- admin update only.
create policy "availability_public_read" on availability_settings
  for select using (true);
create policy "availability_admin_update" on availability_settings
  for update using (is_admin());

-- categories: public sees only active ones; admin sees/edits everything.
create policy "categories_public_read" on categories
  for select using (active or is_admin());
create policy "categories_admin_write" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- services: same pattern — public sees active, admin sees/edits all.
create policy "services_public_read" on services
  for select using (active or is_admin());
create policy "services_admin_write" on services
  for insert with check (is_admin());
create policy "services_admin_update" on services
  for update using (is_admin());
create policy "services_admin_delete" on services
  for delete using (is_admin());

-- styles: public sees bookable ones, admin sees/edits all.
create policy "styles_public_read" on styles
  for select using (bookable or is_admin());
create policy "styles_admin_write" on styles
  for insert with check (is_admin());
create policy "styles_admin_update" on styles
  for update using (is_admin());
create policy "styles_admin_delete" on styles
  for delete using (is_admin());

-- gallery_images: public sees homepage-visible images, admin sees all.
create policy "gallery_public_read" on gallery_images
  for select using (visible_on_home or is_admin());
create policy "gallery_admin_write" on gallery_images
  for insert with check (is_admin());
create policy "gallery_admin_update" on gallery_images
  for update using (is_admin());
create policy "gallery_admin_delete" on gallery_images
  for delete using (is_admin());

-- faqs: public sees published, admin sees/edits all.
create policy "faqs_public_read" on faqs
  for select using (published or is_admin());
create policy "faqs_admin_write" on faqs
  for insert with check (is_admin());
create policy "faqs_admin_update" on faqs
  for update using (is_admin());
create policy "faqs_admin_delete" on faqs
  for delete using (is_admin());

-- testimonials: public sees approved, admin sees/edits all.
create policy "testimonials_public_read" on testimonials
  for select using (approved or is_admin());
create policy "testimonials_admin_write" on testimonials
  for insert with check (is_admin());
create policy "testimonials_admin_update" on testimonials
  for update using (is_admin());
create policy "testimonials_admin_delete" on testimonials
  for delete using (is_admin());

-- community_posts: public sees published, admin sees/edits all.
create policy "community_public_read" on community_posts
  for select using (published or is_admin());
create policy "community_admin_write" on community_posts
  for insert with check (is_admin());
create policy "community_admin_update" on community_posts
  for update using (is_admin());
create policy "community_admin_delete" on community_posts
  for delete using (is_admin());

-- newsletter_subscribers: no public read (privacy) — anyone can sign up,
-- only admin can view/export the list.
create policy "newsletter_public_signup" on newsletter_subscribers
  for insert with check (true);
create policy "newsletter_admin_read" on newsletter_subscribers
  for select using (is_admin());
create policy "newsletter_admin_update" on newsletter_subscribers
  for update using (is_admin());
create policy "newsletter_admin_delete" on newsletter_subscribers
  for delete using (is_admin());


-- ============================================================
-- FILE: 0007_rls_people_and_bookings.sql
-- ============================================================
-- ============================================================
-- Migration 007: Row Level Security — people, bookings, payments, admin
-- ============================================================

alter table customers enable row level security;
alter table saved_addresses enable row level security;
alter table customer_notifications enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table payments enable row level security;
alter table admin_users enable row level security;

-- customers: a customer can see and update only their own row (id is the
-- same uuid as their auth.users id). Admins can see and update all.
create policy "customers_self_read" on customers
  for select using (id = auth.uid() or is_admin());
create policy "customers_self_insert" on customers
  for insert with check (id = auth.uid());
create policy "customers_self_update" on customers
  for update using (id = auth.uid() or is_admin());

-- saved_addresses: customer manages their own; admin can read all
-- (useful for confirming a home-service address by phone, etc).
create policy "addresses_owner_all" on saved_addresses
  for all
  using (customer_id = auth.uid() or is_admin())
  with check (customer_id = auth.uid() or is_admin());

-- customer_notifications: customer reads/marks-read their own; only the
-- system (via service role, e.g. a booking-confirmed trigger/edge
-- function) or admin inserts new ones.
create policy "notifications_owner_read" on customer_notifications
  for select using (customer_id = auth.uid() or is_admin());
create policy "notifications_owner_update" on customer_notifications
  for update using (customer_id = auth.uid() or is_admin());
create policy "notifications_admin_insert" on customer_notifications
  for insert with check (is_admin());

-- bookings: anyone (including guests) can create a booking. A signed-in
-- customer can only attach their own id to a booking, or leave it null
-- for a guest-style checkout while still logged in. Reading/updating is
-- restricted to the booking's own customer or an admin — a guest booking
-- (customer_id null) can only be read back immediately after insert via
-- the row Postgres returns, not queried later without an account.
create policy "bookings_public_insert" on bookings
  for insert
  with check (customer_id is null or customer_id = auth.uid());
create policy "bookings_owner_read" on bookings
  for select using (customer_id = auth.uid() or is_admin());
create policy "bookings_owner_update" on bookings
  for update using (customer_id = auth.uid() or is_admin());
create policy "bookings_admin_delete" on bookings
  for delete using (is_admin());

-- reviews: public sees only visible+approved reviews; admin sees all.
-- A customer can submit a review only for a booking that's actually
-- theirs, keeping the "verified" badge meaningful.
create policy "reviews_public_read" on reviews
  for select using (visible or is_admin());
create policy "reviews_owner_insert" on reviews
  for insert
  with check (
    is_admin()
    or exists (
      select 1 from bookings bk
      where bk.id = booking_id and bk.customer_id = auth.uid()
    )
  );
create policy "reviews_admin_update" on reviews
  for update using (is_admin());
create policy "reviews_admin_delete" on reviews
  for delete using (is_admin());

-- payments: admin has full access. A customer can view (read-only)
-- payment records tied to their own bookings, but never write to them —
-- payment status changes come from the payment provider or an admin.
create policy "payments_owner_read" on payments
  for select using (
    is_admin()
    or exists (
      select 1 from bookings bk
      where bk.id = booking_id and bk.customer_id = auth.uid()
    )
  );
create policy "payments_admin_write" on payments
  for insert with check (is_admin());
create policy "payments_admin_update" on payments
  for update using (is_admin());
create policy "payments_admin_delete" on payments
  for delete using (is_admin());

-- admin_users: any admin can see the staff list (needed for the Admin
-- Users screen). Only a super-admin can add, remove, or change another
-- admin's role/active status. Any admin can update their own name/email
-- (self-service profile edit) but not their own role or active flag —
-- that column-level restriction is enforced by the trigger below, since
-- RLS alone works at row granularity, not column granularity.
create policy "admin_users_read" on admin_users
  for select using (is_admin());
create policy "admin_users_super_admin_insert" on admin_users
  for insert with check (is_super_admin());
create policy "admin_users_update" on admin_users
  for update using (is_super_admin() or id = auth.uid());
create policy "admin_users_super_admin_delete" on admin_users
  for delete using (is_super_admin());

-- Column-level guard: a non-super-admin editing their own row cannot
-- change their own role or active flag (would otherwise let any admin
-- self-promote to super-admin).
create or replace function prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_super_admin() then
    if new.role <> old.role or new.active <> old.active then
      raise exception 'Only a super-admin can change role or active status.';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_admin_users_no_self_escalation
  before update on admin_users
  for each row execute function prevent_self_role_escalation();


-- ============================================================
-- FILE: 0008_seed_data.sql
-- ============================================================
-- ============================================================
-- Migration 008: Seed data
--
-- Direct translation of the frontend's demo data in src/data/*.ts, so the
-- database starts in the same state the React app currently ships with.
-- Tables that depend on auth.users existing first (customers, bookings,
-- admin_users, reviews, payments, notifications, saved_addresses) are
-- NOT seeded here — see the note at the bottom of this file for how to
-- seed those once you've created real (or test) auth users.
-- ============================================================

insert into categories (id, slug, label, description, image, sort_order, active) values
  ('cat-womens', 'womens-styling', 'Women''s Styles', 'Braids, weaves, updos and silk presses — styled for every occasion.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80', 1, true),
  ('cat-mens', 'mens-styling', 'Men''s Styles', 'Precision cuts and grooming for the modern gentleman.', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80', 2, true),
  ('cat-dreadlocking', 'dreadlocking', 'Dreadlocks', 'Loc starts, retwists and maintenance built for the long run.', 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80', 3, true),
  ('cat-weaving', 'hair-weaving', 'Hair Weaving', 'Seamless sew-ins, frontals and full luxury installs.', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', 4, true),
  ('cat-home', 'home-service', 'Home Service', 'The full studio experience, delivered to your door.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', 5, true),
  ('cat-custom', 'custom-styling', 'Custom Styling', 'Bespoke looks built from your reference and vision.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80', 6, true);

insert into services (id, name, category, description, image, duration_minutes, price_from, home_service_available, featured, active) values
  ('svc-hair-weaving', 'Luxury Hair Weaving', 'hair-weaving', 'Premium weaving techniques for a seamless, natural finish — from classic sew-ins to full luxury installs.', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80', 180, null, true, true, true),
  ('svc-womens-styling', 'Women''s Hairstyles', 'womens-styling', 'Editorial-grade styling for every occasion — braids, updos, silk presses and signature looks.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80', 120, null, true, true, true),
  ('svc-mens-styling', 'Men''s Hairstyles', 'mens-styling', 'Sharp cuts, line-ups and grooming, tailored with precision for the modern gentleman.', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80', 60, null, true, true, true),
  ('svc-dreadlocking', 'Dreadlocking', 'dreadlocking', 'Expert loc starts, retwists and styling — built for healthy, long-term growth.', 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1200&q=80', 150, null, true, true, true),
  ('svc-home-service', 'Home Service', 'home-service', 'The full DIJAH HAIR LAB experience, brought to your doorstep anywhere in Lagos.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80', null, null, true, true, true),
  ('svc-custom-styling', 'Custom Styling', 'custom-styling', 'Bring a reference or a vision — we build a bespoke style around exactly what you want.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80', null, null, true, false, true);

insert into styles (id, name, service_id, category, gender, description, images, duration_minutes, price_from, rating, review_count, is_new_arrival, is_popular, is_featured, bookable) values
  ('sty-luxury-sew-in', 'Luxury Sew-In Weave', 'svc-hair-weaving', 'hair-weaving', 'women', 'A seamless full sew-in with a natural hairline finish, styled to your preferred length and texture.', array['https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80'], 240, null, 4.9, 0, false, true, true, true),
  ('sty-frontal-install', 'Frontal Lace Install', 'svc-hair-weaving', 'hair-weaving', 'women', 'A melted, undetectable frontal install with custom parting and bleached knots.', array['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80'], 300, null, 4.8, 0, true, true, true, true),
  ('sty-knotless-braids', 'Knotless Box Braids', 'svc-womens-styling', 'womens-styling', 'women', 'Tension-free knotless braids in a length and thickness of your choice.', array['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80'], 300, null, 4.9, 0, false, true, true, true),
  ('sty-silk-press', 'Silk Press & Trim', 'svc-womens-styling', 'womens-styling', 'women', 'A sleek, bouncy silk press finished with a healthy trim and shine treatment.', array['https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1000&q=80'], 90, null, 4.7, 0, false, false, false, true),
  ('sty-bridal-updo', 'Bridal Editorial Updo', 'svc-womens-styling', 'womens-styling', 'women', 'A sculpted, editorial updo designed for bridal parties and special occasions.', array['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80'], 120, null, 5.0, 0, true, false, true, true),
  ('sty-classic-fade', 'Classic Skin Fade', 'svc-mens-styling', 'mens-styling', 'men', 'A precision skin fade with sharp line-up, tailored to your face shape.', array['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80'], 45, null, 4.8, 0, false, true, true, true),
  ('sty-textured-crop', 'Textured Crop', 'svc-mens-styling', 'mens-styling', 'men', 'A low-maintenance textured crop with a natural, modern silhouette.', array['https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80'], 45, null, 4.6, 0, true, false, false, true),
  ('sty-loc-start', 'Two-Strand Loc Start', 'svc-dreadlocking', 'dreadlocking', 'unisex', 'A neat two-strand twist loc start, sized and mapped to your head shape.', array['https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1000&q=80'], 240, null, 4.9, 0, false, true, true, true),
  ('sty-loc-retwist', 'Loc Retwist & Style', 'svc-dreadlocking', 'dreadlocking', 'unisex', 'A fresh retwist with root definition, finished with a style of your choice.', array['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80'], 120, null, 4.8, 0, false, false, false, true),
  ('sty-custom-vision', 'Custom Vision Style', 'svc-custom-styling', 'custom-styling', 'unisex', 'Bring a reference image — we build it from the ground up, just for you.', array['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80'], null, null, 5.0, 0, true, false, false, true);

insert into faqs (id, question, answer, sort_order, published) values
  ('faq-appointment', 'Do I need an appointment?', 'Yes — we recommend booking ahead through our online booking page or WhatsApp so we can reserve the right amount of time for your style.', 1, true),
  ('faq-home-service', 'Do you offer home service?', 'Yes, home service is available across Lagos. Select "Home Service" during booking and provide your address, area and any landmark.', 2, true),
  ('faq-location', 'Where are you located?', 'We are based in Agungi, Ajah, Lagos State, Nigeria.', 3, true),
  ('faq-how-to-book', 'How do I book a hairstyle?', 'Use the "Book Now" button to go through our step-by-step booking flow, or message us directly on WhatsApp.', 4, true),
  ('faq-choose-style', 'Can I choose my preferred hairstyle?', 'Absolutely. Browse our style gallery, pick a look, and it will be pre-selected when you start your booking. You can also bring a reference image.', 5, true),
  ('faq-reschedule', 'Can I reschedule my appointment?', 'Yes, reschedule requests can be made from your account or by contacting us directly on WhatsApp as early as possible.', 6, true),
  ('faq-duration', 'How long does a hairstyle take?', 'Duration varies by style — most estimated times are shown on the service and style pages, and confirmed when you book.', 7, true),
  ('faq-gender', 'Do you style both men and women?', 'Yes, we offer luxury styling for both men and women.', 8, true),
  ('faq-contact', 'How do I contact you?', 'The fastest way is WhatsApp at 07036518121, or through our contact form.', 9, true),
  ('faq-payment', 'What payment methods are available?', 'Payment details are confirmed with you directly when your booking is reviewed — reach out on WhatsApp for current options.', 10, true);

insert into testimonials (id, customer_name, location, rating, review, service, occurred_on, is_demo, approved, featured) values
  ('tst-1', 'Demo Client A', 'Lekki, Lagos', 5, 'Sample review — the kind of detail-oriented styling and finish DIJAH HAIR LAB aims to deliver on every appointment.', 'Women''s Hairstyles', '2026-06-02', true, true, true),
  ('tst-2', 'Demo Client B', 'Ajah, Lagos', 5, 'Sample review — illustrating the kind of home-service experience DIJAH HAIR LAB is built to provide.', 'Home Service', '2026-05-18', true, true, true),
  ('tst-3', 'Demo Client C', 'Victoria Island, Lagos', 4.5, 'Sample review — a placeholder showing the tone and structure real testimonials will follow.', 'Dreadlocking', '2026-04-27', true, true, true);

insert into gallery_images (id, url, caption, category, featured, visible_on_home, sort_order) values
  ('gal-1', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80', 'Luxury sew-in finish', 'hair-weaving', true, true, 1),
  ('gal-2', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80', 'Knotless braids, side profile', 'womens-styling', true, true, 2),
  ('gal-3', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80', 'Sharp skin fade', 'mens-styling', false, true, 3),
  ('gal-4', 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1000&q=80', 'Fresh loc retwist', 'dreadlocking', true, true, 4),
  ('gal-5', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80', 'Home service session', 'home-service', false, false, 5),
  ('gal-6', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80', 'Custom vision style', 'custom-styling', false, true, 6);

-- ============================================================
-- NOTE: seeding auth-dependent tables (customers, bookings, admin_users,
-- reviews, payments, notifications, saved_addresses)
--
-- These all reference auth.users(id), which Supabase manages separately
-- from this migration. To seed demo data for local testing:
--
--   1. Create the users via Supabase Auth (dashboard, or
--      `supabase.auth.admin.createUser()` from a trusted server context) —
--      e.g. amara@example.com for a demo customer, admin@dijahhairlab.com
--      for a demo super-admin.
--   2. Note the uuid each one gets back.
--   3. Insert matching rows, e.g.:
--
--        insert into customers (id, full_name, email, phone, registered_at)
--        values ('<uuid-from-step-2>', 'Amara Okafor', 'amara@example.com', '08012345678', '2026-03-14');
--
--        insert into admin_users (id, name, email, role)
--        values ('<uuid-from-step-2>', 'Bolanle Dijah', 'admin@dijahhairlab.com', 'super-admin');
--
-- Bookings, reviews, payments and notifications can then reference that
-- customer's uuid directly.
-- ============================================================


-- ============================================================
-- FILE: 0009_wishlist.sql
-- ============================================================
-- ============================================================
-- Migration 009: Wishlist
--
-- Missed in the original schema — the customer account's Wishlist page
-- needs real backing. One row per (customer, style) pair.
-- ============================================================

create table wishlist_items (
  customer_id uuid not null references customers (id) on delete cascade,
  style_id text not null references styles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, style_id)
);

alter table wishlist_items enable row level security;

create policy "wishlist_owner_all" on wishlist_items
  for all
  using (customer_id = auth.uid() or is_admin())
  with check (customer_id = auth.uid());


-- ============================================================
-- FILE: 0010_storage.sql
-- ============================================================
-- ============================================================
-- Migration 0010: Storage bucket for gallery uploads
--
-- Creates a public "gallery" bucket (anyone can view the images — they're
-- shown on the public site) with write access restricted to admins via
-- the same is_admin() function used everywhere else. Run this after
-- 0001-0009.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Anyone can view files in the gallery bucket (it's public-facing content).
create policy "gallery_bucket_public_read"
on storage.objects for select
using (bucket_id = 'gallery');

-- Only admins can upload, replace, or delete gallery images.
create policy "gallery_bucket_admin_insert"
on storage.objects for insert
with check (bucket_id = 'gallery' and public.is_admin());

create policy "gallery_bucket_admin_update"
on storage.objects for update
using (bucket_id = 'gallery' and public.is_admin());

create policy "gallery_bucket_admin_delete"
on storage.objects for delete
using (bucket_id = 'gallery' and public.is_admin());


