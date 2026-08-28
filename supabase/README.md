# DIJAH HAIR LAB — Database Schema (Supabase / Postgres)

This folder contains the SQL schema that mirrors `src/types/index.ts`. It's
written for [Supabase](https://supabase.com) (Postgres + Auth + Storage +
Row Level Security) but is plain enough SQL to adapt to any Postgres host.

## What's here

Run the migrations **in order** — later files depend on tables/functions
created earlier:

| File | What it does |
|---|---|
| `0001_extensions_and_enums.sql` | Postgres extensions + enum types (booking status, admin roles, etc.) |
| `0002_business_and_catalog.sql` | Business settings, availability rules, services, styles, categories, gallery, FAQs, testimonials, newsletter, community posts |
| `0003_people_and_bookings.sql` | Customers, saved addresses, notifications, bookings, reviews, payments, admin users |
| `0004_triggers_and_views.sql` | Auto-updating timestamps, auto-generated booking references, a `customer_directory` view |
| `0005_auth_functions.sql` | `is_admin()`, `is_super_admin()`, `is_active_customer()` helper functions |
| `0006_rls_public_content.sql` | Row Level Security for public-facing content (services, styles, FAQs, etc.) |
| `0007_rls_people_and_bookings.sql` | Row Level Security for customers, bookings, payments, admin users |
| `0008_seed_data.sql` | Seeds services, styles, categories, FAQs, testimonials, gallery — the same demo data the React app currently ships with |

## How to apply this

**Option A — Supabase CLI (recommended):**

```bash
npx supabase init          # if you haven't already
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

**Option B — Supabase Dashboard:**

Open the SQL Editor in your project dashboard and run each file in order,
top to bottom.

## Design decisions worth knowing about

- **Text IDs, not UUIDs, for catalog tables.** `services`, `styles`,
  `categories`, `gallery_images`, `faqs`, `testimonials`, and
  `community_posts` use human-readable `text` primary keys (e.g.
  `'svc-hair-weaving'`) instead of UUIDs. These are a small,
  admin-curated set, not generated at scale — readable IDs make the seed
  data a direct translation of `src/data/*.ts` and make debugging easier.
  Everything transactional (bookings, payments, reviews, customers,
  addresses, notifications) uses UUIDs, since those are created per-event
  with no natural slug.
- **Guest checkout is preserved.** `bookings.customer_id` is nullable —
  the booking flow doesn't require an account, matching the current
  frontend. `customer_full_name`/`phone`/`email` are always stored on the
  booking row itself, so a booking's record of who it was for doesn't
  change even if a linked account is edited later.
- **Row Level Security enforces what the UI currently only hides.**
  Right now, the admin dashboard's role restrictions (e.g. "only
  Super Admin can add other admins") are just conditionally-rendered
  buttons — anyone with dev tools open could call the same functions.
  Once this schema is live, those same rules are enforced by Postgres via
  RLS policies and a trigger (`prevent_self_role_escalation`), regardless
  of what the client sends.
- **`customer_directory` is a view, not a table.** It mirrors what
  `src/hooks/useAdminOps.tsx` currently computes client-side by grouping
  the bookings array by email — moving that aggregation into SQL means
  the admin dashboard can query one view instead of pulling every booking
  row into the browser.
- **Auth-dependent tables aren't seeded here.** `customers`, `admin_users`,
  `bookings`, `reviews`, `payments`, `saved_addresses`, and
  `customer_notifications` all reference `auth.users(id)`, which Supabase
  manages separately. See the comment at the bottom of `0008_seed_data.sql`
  for how to seed demo people once you've created real (or test) auth
  users via Supabase Auth.

## What's not done yet

- The frontend still reads from `src/data/*.ts` seed files and holds
  everything in React Context — it isn't wired up to this schema yet.
  That's the next step: swap each provider's internal state for Supabase
  queries (`@supabase/supabase-js`), keeping the same public interface
  (`useAdminOps()`, `useAuth()`, etc.) so the components using them don't
  need to change.
- No Storage bucket policies yet for the Gallery's image uploads (currently
  a URL-paste UI in the admin dashboard) — that's a small addition once
  you're ready to accept real file uploads.
- No Edge Functions — e.g. sending a WhatsApp/email notification when a
  booking is created, or an automated `customer_notifications` row on
  status change, would live there.
