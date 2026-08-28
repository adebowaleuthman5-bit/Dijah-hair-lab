import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Booking, BookingStatus, PaymentRecord, PaymentStatus } from '@/types';

export async function createBookingRemote(
  booking: Booking,
  customerId: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };

  const { error } = await supabase.from('bookings').insert({
    id: booking.id,
    reference: booking.reference,
    customer_id: customerId,
    customer_full_name: booking.customer.fullName,
    customer_phone: booking.customer.phone,
    customer_email: booking.customer.email,
    customer_address: booking.customer.address ?? null,
    special_request: booking.customer.specialRequest ?? null,
    reference_image_url: booking.customer.referenceImageName ?? null,
    service_id: booking.serviceId,
    style_id: booking.styleId ?? null,
    location_type: booking.locationType,
    home_full_address: booking.homeServiceDetails?.fullAddress ?? null,
    home_area: booking.homeServiceDetails?.area ?? null,
    home_landmark: booking.homeServiceDetails?.landmark ?? null,
    home_instructions: booking.homeServiceDetails?.instructions ?? null,
    booking_date: booking.date,
    booking_time: booking.time,
    estimated_cost: booking.estimatedCost ?? null,
    status: booking.status,
  });

  return error ? { success: false, error: error.message } : { success: true };
}

export async function fetchAllBookings(): Promise<Booking[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('bookings').select('*').order('booking_date', { ascending: false });
  if (error || !data) return null;
  return data.map(mapBookingRow);
}

export async function fetchBookingsForCustomer(customerId: string): Promise<Booking[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('booking_date', { ascending: false });
  if (error || !data) return null;
  return data.map(mapBookingRow);
}

export async function updateBookingStatusRemote(id: string, status: BookingStatus): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('bookings').update({ status }).eq('id', id);
}

export async function rescheduleBookingRemote(id: string, date: string, time: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('bookings').update({ booking_date: date, booking_time: time, status: 'pending' }).eq('id', id);
}

export async function fetchAllPayments(): Promise<PaymentRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('payments')
    .select('*, bookings!inner(reference, customer_full_name)')
    .order('payment_date', { ascending: false });
  if (error || !data) return null;
  return data.map(mapPaymentRow);
}

export async function updatePaymentStatusRemote(id: string, status: PaymentStatus): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('payments').update({ status }).eq('id', id);
}

function mapBookingRow(row: any): Booking {
  return {
    id: row.id,
    reference: row.reference,
    serviceId: row.service_id,
    styleId: row.style_id ?? undefined,
    locationType: row.location_type,
    homeServiceDetails:
      row.location_type === 'home-service'
        ? {
            fullAddress: row.home_full_address,
            area: row.home_area,
            landmark: row.home_landmark ?? undefined,
            instructions: row.home_instructions ?? undefined,
          }
        : undefined,
    date: row.booking_date,
    time: row.booking_time,
    customer: {
      fullName: row.customer_full_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.customer_address ?? undefined,
      specialRequest: row.special_request ?? undefined,
      referenceImageName: row.reference_image_url ?? undefined,
    },
    estimatedCost: row.estimated_cost ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapPaymentRow(row: any): PaymentRecord {
  return {
    id: row.id,
    bookingId: row.booking_id,
    bookingReference: row.bookings?.reference ?? '',
    customerName: row.bookings?.customer_full_name ?? '',
    amount: row.amount ?? undefined,
    method: row.method ?? undefined,
    status: row.status,
    date: row.payment_date,
  };
}
