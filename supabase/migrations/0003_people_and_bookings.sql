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
