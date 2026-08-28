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
