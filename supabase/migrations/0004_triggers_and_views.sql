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
create view customer_directory as
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
