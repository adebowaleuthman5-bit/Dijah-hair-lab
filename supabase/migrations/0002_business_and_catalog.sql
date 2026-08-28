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
