# DIJAH HAIR LAB — Web App (Complete: Public Site, Booking, Customer Account, Admin Dashboard & Supabase Backend)

A premium React + TypeScript + Tailwind CSS site for DIJAH HAIR LAB, Agungi, Ajah, Lagos.

## What's included

- **Public website**: Home, Services, Styles (with search/filter), Style Detail,
  About, Testimonials, FAQ, Contact.
- **Booking system**: full 8-step flow (Service → Style → Location → Date → Time
  → Details → Summary → Confirmation), with a WhatsApp-fallback booking option.
  Bookings made while logged in are saved straight into the customer's account.
- **Customer account**: Login, Register, Forgot Password, and a full
  dashboard — Overview, My Bookings (with cancel/reschedule), Wishlist,
  Saved Addresses, Profile, Notifications.
- **Admin dashboard** (`/admin`): Dashboard overview with charts, Bookings
  management, Calendar (day/week/month), Availability settings, Services,
  Styles, Categories, Customers directory, Gallery, Reviews, Testimonials,
  Newsletter, Community posts, Home Service requests, Payments, FAQs,
  Social Media, Settings, role-gated Admin Users, and the admin's own
  Profile.
- **A real Postgres/Supabase schema** (`supabase/migrations`) with Row
  Level Security — see `supabase/README.md`.
- **The frontend is wired to that schema**, in a way that doesn't require
  you to have a Supabase project set up to keep using the app — see
  "Demo mode vs. live mode" below.

## Demo mode vs. live mode

The app runs in one of two modes, decided automatically by whether
`.env` has real Supabase credentials in it:

- **No `.env` (or it's empty):** runs entirely on bundled demo data held
  in memory. This is the default — `npm install && npm run dev` works
  immediately, no setup required. Nothing persists across a hard refresh
  except auth sessions (via `localStorage`).
- **`.env` has real credentials:** every read and write goes to your
  actual Supabase project instead — real signup/login, real bookings,
  admin edits that genuinely show up on the public site, the works.

To switch to live mode: copy `.env.example` to `.env`, fill in your
Supabase project's URL and anon key (Project Settings → API), and follow
`supabase/README.md` to apply the schema. No code changes needed either
way — every component calls the same functions regardless of mode.

**Known limits of the live-mode wiring**, worth knowing about before you
rely on it:
- Creating a *new* admin user from the Admin Users screen requires a
  service_role key, which can only be used server-side (an Edge Function),
  never in the browser — that button is a placeholder until that piece
  exists.
- Public pages re-fetch live catalog data once per app load, not
  continuously — an admin's edit shows up for a visitor on their next
  fresh page load, not instantly in an already-open tab (no realtime
  subscription yet).
- This has been written carefully against the schema but **not run
  against a live Supabase project** (the environment this was built in
  has no internet access) — budget time to debug the first real connection.

## Demo logins (demo mode)

**Customer account** (`/login`): use `amara@example.com` with any password —
she's seeded with sample booking history. Registering signs you in
immediately with a fresh account.

**Admin dashboard** (`/admin/login`, or "Staff Login" in the site footer):
use `admin@dijahhairlab.com` with any password for full Super Admin access.
Other seeded admin accounts (`chidinma@dijahhairlab.com`,
`tola@dijahhairlab.com`) demonstrate role-gated access — only Super Admin
can add/remove other admin users, for example.

In live mode, these demo emails won't work — you'll need real accounts
created via Supabase Auth (see `supabase/README.md`'s seeding notes).

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Logo

The official DIJAH HAIR LAB logo is in place at `src/assets/logo.png` — the
marble background from the supplied photo was removed and the image cropped
tight to the mark. It's wired into `src/components/ui/Logo.tsx`, used across
the navbar, footer, and favicon. If you get a higher-resolution or vector
(SVG) version later, just replace `src/assets/logo.png` (or update the import
in `Logo.tsx`) and it updates everywhere automatically.

## Business info

All contact/location/social details live in `src/data/business.ts`, exported
as a mutable `businessSettings` object with an `updateBusinessSettings()`
function. The admin Settings and Social Media pages call this directly, so
changes made there are reflected across the public site (in live mode, this
also writes through to the `business_settings` table). Business hours are
intentionally left unset until confirmed.

## How the demo/live split actually works (for whoever picks this up next)

- `src/lib/supabaseClient.ts` exports `isSupabaseConfigured` — the one
  flag everything else checks.
- `src/services/supabase/*.ts` is the entire data-access layer: one file
  per domain (auth, bookings, catalog, content, people, settings, customer
  data), each function returning `null` (or doing nothing, for writes) when
  Supabase isn't configured.
- Every React Context provider in `src/hooks/*.tsx` starts from the bundled
  demo data for an instant first render, then — if live — fetches the real
  rows in a `useEffect` and replaces local state. Every mutation updates
  local state immediately (optimistic) and fires the matching Supabase
  write in the background.
- Public pages that read `services`/`styles`/`faqs`/`testimonials` directly
  from `src/data/*.ts` (rather than through a hook) work a little
  differently: those files export mutable arrays with a `replace*()`
  function, mutated in place by `src/lib/loadPublicCatalog.ts` — see the
  comments there and in `PublicLayout.tsx` for why a plain array mutation
  needs a manual re-render trigger to actually show up on screen.

## Notes on demo content

- Testimonials and reviews are clearly marked as demo content — replace
  with real ones before launch.
- Prices are omitted (`priceFrom: undefined`) wherever a real price wasn't
  provided; the UI shows "Contact us for pricing" automatically.
- Booking availability on the public site (`src/data/availability.ts`)
  still generates a deterministic demo pattern of open/blocked slots — it
  isn't wired to `/admin/availability` or the `availability_settings`
  table yet. That's the next gap worth closing.
- Payments (`/admin/payments`) are a UI wired to the `payments` table, but
  there's no real payment provider (Paystack, etc.) behind it yet — status
  changes are manual.

