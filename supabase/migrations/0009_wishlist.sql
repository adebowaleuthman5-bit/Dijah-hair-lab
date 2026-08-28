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
