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
