// ============================================================
// DIJAH HAIR LAB — Shared data models
// These types back the public site now, and the customer +
// admin experiences later. Keep this file the single source
// of truth for shape; Supabase tables should mirror it 1:1.
// ============================================================

export type ServiceCategory =
  | 'hair-weaving'
  | 'womens-styling'
  | 'mens-styling'
  | 'dreadlocking'
  | 'home-service'
  | 'custom-styling';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  image: string;
  durationMinutes?: number;
  priceFrom?: number; // in NGN, undefined => "Contact us for pricing"
  homeServiceAvailable: boolean;
  featured: boolean;
  active: boolean;
}

export type StyleGender = 'women' | 'men' | 'unisex';

export interface Style {
  id: string;
  name: string;
  serviceId: string;
  category: ServiceCategory;
  gender: StyleGender;
  description: string;
  images: string[];
  durationMinutes?: number;
  priceFrom?: number;
  rating: number; // 0-5
  reviewCount: number;
  isNewArrival: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  bookable: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location?: string;
  rating: number;
  review: string;
  service?: string;
  date: string; // ISO date
  photo?: string;
  isDemo: boolean;
  approved: boolean;
  featured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export type BookingLocationType = 'in-shop' | 'home-service';

export interface BookingCustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  specialRequest?: string;
  referenceImageName?: string;
}

export interface HomeServiceDetails {
  fullAddress: string;
  area: string;
  landmark?: string;
  instructions?: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  styleId?: string;
  locationType: BookingLocationType;
  homeServiceDetails?: HomeServiceDetails;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  customer: BookingCustomerDetails;
  estimatedCost?: number;
  status: BookingStatus;
  createdAt: string;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  maxBookings: number;
  currentBookings: number;
}

// Admin-configurable availability rules. In this demo the public booking
// calendar (src/data/availability.ts) uses its own fixed demo generator —
// this shape is what /admin/availability edits, ready to become the single
// source once the calendar reads from a real backend instead of demo logic.
export interface AvailabilitySettings {
  openingTime: string; // "9:00 AM"
  closingTime: string; // "5:00 PM"
  workingDays: string[]; // e.g. ['Mon','Tue','Wed','Thu','Fri','Sat']
  breakStart?: string;
  breakEnd?: string;
  appointmentDurationMinutes: number;
  maxBookingsPerSlot: number;
  blockedDates: string[]; // YYYY-MM-DD
  holidayDates: string[]; // YYYY-MM-DD
  homeServiceAvailable: boolean;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  whatsappNumber: string; // digits, local format as provided
  tiktokHandle: string;
  instagramHandle?: string;
  facebookHandle?: string;
  businessHours?: BusinessHours[];
  contactEmail?: string;
  seoTitle?: string;
  seoDescription?: string;
  notifyOnNewBooking?: boolean;
  notifyOnNewSubscriber?: boolean;
  homeServiceEnabled: boolean;
}

export interface BusinessHours {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  open?: string;
  close?: string;
  closed: boolean;
}

// ============================================================
// Customer account models
// ============================================================

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registeredAt: string; // ISO date
}

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  fullAddress: string;
  area: string;
  landmark?: string;
  isDefault: boolean;
}

export type NotificationType = 'booking' | 'promo' | 'system';

export interface CustomerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string; // ISO date
  read: boolean;
}


// Draft object carried through the multi-step booking flow
export interface BookingDraft {
  serviceId?: string;
  styleId?: string;
  locationType?: BookingLocationType;
  homeServiceDetails?: HomeServiceDetails;
  date?: string;
  time?: string;
  customer?: BookingCustomerDetails;
}

// ============================================================
// Admin dashboard models
// ============================================================

export type AdminRole = 'super-admin' | 'manager' | 'booking-manager' | 'content-manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  lastLogin?: string; // ISO date
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: ServiceCategory;
  featured: boolean;
  visibleOnHome: boolean;
  order: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  service?: string;
  date: string; // ISO date
  verified: boolean; // true once tied to a completed booking
  status: 'pending' | 'approved' | 'rejected';
  visible: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  joinedAt: string; // ISO date
  status: 'active' | 'unsubscribed';
}

export type CommunityPostType = 'announcement' | 'beauty-tip' | 'offer' | 'featured-style';

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  title: string;
  body: string;
  published: boolean;
  createdAt: string; // ISO date
}

export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  amount?: number;
  method?: string;
  status: PaymentStatus;
  date: string; // ISO date
}

// A manageable taxonomy entity. Note: services/styles still key off the
// fixed ServiceCategory union for referential integrity in this demo;
// AdminCategory controls how that fixed set is *labeled and displayed*
// (name, description, image, order, active/inactive) rather than allowing
// arbitrary new category slugs — a full dynamic taxonomy would need
// services/styles to reference categories by id instead of a union type,
// which is a natural next step once this is backed by a real database.
export interface AdminCategory {
  id: string;
  slug: ServiceCategory;
  label: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

// A lightweight directory entry aggregating a customer's activity —
// derived from bookings + registered accounts rather than stored directly.
export interface CustomerDirectoryEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registeredAt?: string; // undefined => guest, never created an account
  totalBookings: number;
  lastBookingDate?: string;
  status: 'active' | 'deactivated';
}

