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
