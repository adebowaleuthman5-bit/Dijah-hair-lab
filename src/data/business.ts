import { BusinessSettings } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { fetchBusinessSettings, updateBusinessSettingsRemote } from '@/services/supabase/settingsService';

// Centralized business info. This is a mutable singleton (not just a plain
// const) so that admin edits via updateBusinessSettings() are visible
// everywhere that imports `businessSettings` — public components read its
// properties directly at render time, so once /admin/settings calls
// updateBusinessSettings(), the next render (e.g. after navigating back to
// the public site) picks up the change automatically. No context needed
// just for this.
export const businessSettings: BusinessSettings = {
  businessName: 'DIJAH HAIR LAB',
  tagline: 'WHERE DESIRE MEET PERFECTION',
  addressLine: 'Agungi',
  city: 'Ajah',
  state: 'Lagos State',
  country: 'Nigeria',
  whatsappNumber: '07036518121',
  tiktokHandle: 'omobolanle',
  // Business hours are intentionally left unset — do not invent hours.
  // Populate via /admin/settings once the business confirms them.
  businessHours: undefined,
  contactEmail: undefined,
  seoTitle: 'DIJAH HAIR LAB — Where Desire Meet Perfection',
  seoDescription:
    'Premium hair styling and weaving studio in Agungi, Ajah, Lagos. Book luxury hairstyles, weaving and dreadlocking for men and women.',
  notifyOnNewBooking: true,
  notifyOnNewSubscriber: true,
  homeServiceEnabled: true,
};

// In live mode, mutates the singleton in place with the real row from
// Supabase once fetched — same "components just read the object" pattern
// as updateBusinessSettings below. Called once from App.tsx on mount.
export async function initBusinessSettings(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const remote = await fetchBusinessSettings();
  if (remote) Object.assign(businessSettings, remote);
}

export function updateBusinessSettings(updates: Partial<BusinessSettings>) {
  Object.assign(businessSettings, updates);
  if (isSupabaseConfigured) updateBusinessSettingsRemote(updates);
}

export function getFullAddress(): string {
  return `${businessSettings.addressLine}, ${businessSettings.city}, ${businessSettings.state}, ${businessSettings.country}`;
}
