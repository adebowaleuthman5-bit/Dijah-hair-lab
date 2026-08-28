-- ============================================================
-- DIJAH HAIR LAB — Database Schema
-- Migration 001: Extensions & Enums
--
-- Written for Postgres via Supabase. Every enum and table here maps
-- directly to a TypeScript interface in src/types/index.ts — see the
-- comment above each table for which interface it replaces. Keeping
-- these in lockstep means the frontend types and the database schema
-- never drift apart silently.
-- ============================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- Service / style taxonomy — matches ServiceCategory in types/index.ts
create type service_category as enum (
  'hair-weaving',
  'womens-styling',
  'mens-styling',
  'dreadlocking',
  'home-service',
  'custom-styling'
);

-- Matches StyleGender
create type style_gender as enum ('women', 'men', 'unisex');

-- Matches BookingLocationType
create type booking_location_type as enum ('in-shop', 'home-service');

-- Matches BookingStatus
create type booking_status as enum (
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show'
);

-- Matches PaymentStatus
create type payment_status as enum ('pending', 'successful', 'failed', 'refunded');

-- Matches AdminRole
create type admin_role as enum ('super-admin', 'manager', 'booking-manager', 'content-manager');

-- Matches Review['status']
create type review_status as enum ('pending', 'approved', 'rejected');

-- Matches CommunityPostType
create type community_post_type as enum ('announcement', 'beauty-tip', 'offer', 'featured-style');

-- Matches NotificationType
create type notification_type as enum ('booking', 'promo', 'system');

-- Matches CustomerDirectoryEntry['status'] / general active-inactive toggles
create type account_status as enum ('active', 'deactivated');
