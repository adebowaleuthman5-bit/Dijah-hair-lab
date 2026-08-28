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
