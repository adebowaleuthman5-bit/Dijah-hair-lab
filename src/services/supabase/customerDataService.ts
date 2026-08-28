import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { SavedAddress, CustomerNotification } from '@/types';

// ---------- Saved addresses ----------

export async function fetchSavedAddresses(customerId: string): Promise<SavedAddress[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('saved_addresses').select('*').eq('customer_id', customerId);
  if (error || !data) return null;
  return data.map(
    (r: any): SavedAddress => ({ id: r.id, label: r.label, fullAddress: r.full_address, area: r.area, landmark: r.landmark ?? undefined, isDefault: r.is_default })
  );
}

export async function upsertSavedAddressRemote(customerId: string, address: SavedAddress): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('saved_addresses').upsert({
    id: address.id,
    customer_id: customerId,
    label: address.label,
    full_address: address.fullAddress,
    area: address.area,
    landmark: address.landmark ?? null,
    is_default: address.isDefault,
  });
}

export async function deleteSavedAddressRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('saved_addresses').delete().eq('id', id);
}

// ---------- Notifications ----------

export async function fetchCustomerNotifications(customerId: string): Promise<CustomerNotification[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('customer_notifications')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error || !data) return null;
  return data.map(
    (r: any): CustomerNotification => ({ id: r.id, type: r.type, title: r.title, message: r.message, date: r.created_at, read: r.read })
  );
}

export async function markNotificationReadRemote(id: string, read: boolean): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('customer_notifications').update({ read }).eq('id', id);
}

// ---------- Wishlist ----------
// Guests (not signed in, or Supabase not configured) keep their wishlist
// in-memory only — see useWishlist.tsx. These functions only apply once
// a real customer is signed in against a real project.

export async function fetchWishlist(customerId: string): Promise<string[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('wishlist_items').select('style_id').eq('customer_id', customerId);
  if (error || !data) return null;
  return data.map((r: any) => r.style_id);
}

export async function addToWishlistRemote(customerId: string, styleId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('wishlist_items').insert({ customer_id: customerId, style_id: styleId });
}

export async function removeFromWishlistRemote(customerId: string, styleId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('wishlist_items').delete().eq('customer_id', customerId).eq('style_id', styleId);
}
