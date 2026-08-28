import { Booking, BookingDraft } from '@/types';
import { generateBookingReference } from '@/utils/format';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { createBookingRemote } from '@/services/supabase/bookingsService';

// Builds the Booking object synchronously (needed immediately for the
// Confirmation screen regardless of backend), then — if Supabase is
// configured — fires the real insert in the background. customerId is
// passed in from useAuth() by the caller when the booker is signed in;
// null for guest checkout, which the bookings table supports.
export function createBooking(draft: BookingDraft, customerId: string | null = null): Booking {
  if (!draft.serviceId || !draft.locationType || !draft.date || !draft.time || !draft.customer) {
    throw new Error('Incomplete booking draft');
  }

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    reference: generateBookingReference(),
    serviceId: draft.serviceId,
    styleId: draft.styleId,
    locationType: draft.locationType,
    homeServiceDetails: draft.homeServiceDetails,
    date: draft.date,
    time: draft.time,
    customer: draft.customer,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    createBookingRemote(booking, customerId).catch(() => {
      // Demo booking still succeeds locally even if the remote write
      // fails — the person still sees their confirmation screen either way.
    });
  }

  return booking;
}
