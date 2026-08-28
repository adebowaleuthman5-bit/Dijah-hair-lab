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
