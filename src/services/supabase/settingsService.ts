import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { BusinessSettings, AvailabilitySettings } from '@/types';

export async function fetchBusinessSettings(): Promise<BusinessSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('business_settings').select('*').eq('singleton', true).single();
  if (error || !data) return null;
  return mapBusinessSettingsRow(data);
}

export async function updateBusinessSettingsRemote(updates: Partial<BusinessSettings>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const patch: Record<string, unknown> = {};
  if (updates.businessName !== undefined) patch.business_name = updates.businessName;
  if (updates.tagline !== undefined) patch.tagline = updates.tagline;
  if (updates.addressLine !== undefined) patch.address_line = updates.addressLine;
  if (updates.city !== undefined) patch.city = updates.city;
  if (updates.state !== undefined) patch.state = updates.state;
  if (updates.country !== undefined) patch.country = updates.country;
  if (updates.whatsappNumber !== undefined) patch.whatsapp_number = updates.whatsappNumber;
  if (updates.tiktokHandle !== undefined) patch.tiktok_handle = updates.tiktokHandle;
  if (updates.instagramHandle !== undefined) patch.instagram_handle = updates.instagramHandle;
  if (updates.facebookHandle !== undefined) patch.facebook_handle = updates.facebookHandle;
  if (updates.contactEmail !== undefined) patch.contact_email = updates.contactEmail;
  if (updates.seoTitle !== undefined) patch.seo_title = updates.seoTitle;
  if (updates.seoDescription !== undefined) patch.seo_description = updates.seoDescription;
  if (updates.notifyOnNewBooking !== undefined) patch.notify_on_new_booking = updates.notifyOnNewBooking;
  if (updates.notifyOnNewSubscriber !== undefined) patch.notify_on_new_subscriber = updates.notifyOnNewSubscriber;
  if (updates.homeServiceEnabled !== undefined) patch.home_service_enabled = updates.homeServiceEnabled;

  await supabase.from('business_settings').update(patch).eq('singleton', true);
}

function mapBusinessSettingsRow(row: any): BusinessSettings {
  return {
    businessName: row.business_name,
    tagline: row.tagline,
    addressLine: row.address_line,
    city: row.city,
    state: row.state,
    country: row.country,
    whatsappNumber: row.whatsapp_number,
    tiktokHandle: row.tiktok_handle,
    instagramHandle: row.instagram_handle ?? undefined,
    facebookHandle: row.facebook_handle ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    notifyOnNewBooking: row.notify_on_new_booking,
    notifyOnNewSubscriber: row.notify_on_new_subscriber,
    homeServiceEnabled: row.home_service_enabled,
  };
}

export async function fetchAvailabilitySettings(): Promise<AvailabilitySettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('availability_settings').select('*').eq('singleton', true).single();
  if (error || !data) return null;
  return {
    openingTime: data.opening_time,
    closingTime: data.closing_time,
    workingDays: data.working_days ?? [],
    breakStart: data.break_start ?? undefined,
    breakEnd: data.break_end ?? undefined,
    appointmentDurationMinutes: data.appointment_duration_minutes,
    maxBookingsPerSlot: data.max_bookings_per_slot,
    blockedDates: data.blocked_dates ?? [],
    holidayDates: data.holiday_dates ?? [],
    homeServiceAvailable: data.home_service_available,
  };
}

export async function updateAvailabilitySettingsRemote(updates: Partial<AvailabilitySettings>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const patch: Record<string, unknown> = {};
  if (updates.openingTime !== undefined) patch.opening_time = updates.openingTime;
  if (updates.closingTime !== undefined) patch.closing_time = updates.closingTime;
  if (updates.workingDays !== undefined) patch.working_days = updates.workingDays;
  if (updates.breakStart !== undefined) patch.break_start = updates.breakStart;
  if (updates.breakEnd !== undefined) patch.break_end = updates.breakEnd;
  if (updates.appointmentDurationMinutes !== undefined) patch.appointment_duration_minutes = updates.appointmentDurationMinutes;
  if (updates.maxBookingsPerSlot !== undefined) patch.max_bookings_per_slot = updates.maxBookingsPerSlot;
  if (updates.blockedDates !== undefined) patch.blocked_dates = updates.blockedDates;
  if (updates.homeServiceAvailable !== undefined) patch.home_service_available = updates.homeServiceAvailable;

  await supabase.from('availability_settings').update(patch).eq('singleton', true);
}
