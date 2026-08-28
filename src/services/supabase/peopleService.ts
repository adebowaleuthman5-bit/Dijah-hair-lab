import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { CustomerDirectoryEntry, AdminUser } from '@/types';

export async function fetchCustomerDirectory(): Promise<CustomerDirectoryEntry[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  // Reads the customer_directory VIEW created in migration 0004 — the
  // aggregation (group by email, count bookings, last booking date)
  // happens in SQL instead of client-side, unlike the demo-mode fallback
  // in useAdminOps.tsx which computes the same thing from raw bookings.
  const { data, error } = await supabase.from('customer_directory').select('*').order('last_booking_date', { ascending: false });
  if (error || !data) return null;
  return data.map(
    (r: any): CustomerDirectoryEntry => ({
      id: r.directory_id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      registeredAt: r.registered_at ?? undefined,
      totalBookings: r.total_bookings,
      lastBookingDate: r.last_booking_date ?? undefined,
      status: r.status,
    })
  );
}

export async function setCustomerStatusRemote(customerId: string, status: 'active' | 'deactivated'): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('customers').update({ status }).eq('id', customerId);
}

export async function fetchAdminUsers(): Promise<AdminUser[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('admin_users').select('*');
  if (error || !data) return null;
  return data.map(
    (r: any): AdminUser => ({ id: r.id, name: r.name, email: r.email, role: r.role, active: r.active, lastLogin: r.last_login ?? undefined })
  );
}

export async function updateAdminUserRemote(id: string, updates: Partial<AdminUser>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };
  const patch: Record<string, unknown> = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.email !== undefined) patch.email = updates.email;
  if (updates.role !== undefined) patch.role = updates.role;
  if (updates.active !== undefined) patch.active = updates.active;

  const { error } = await supabase.from('admin_users').update(patch).eq('id', id);
  // Note: the prevent_self_role_escalation trigger (migration 0007) will
  // reject role/active changes from non-super-admins editing their own
  // row — that failure surfaces here as `error`.
  return error ? { success: false, error: error.message } : { success: true };
}

export async function removeAdminUserRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('admin_users').delete().eq('id', id);
}

// Inviting a new admin requires creating their auth.users account first,
// which needs the service_role key — that must run server-side (an Edge
// Function or a small trusted backend), never in the browser bundle.
// This is a placeholder documenting that boundary rather than a real
// client-side call.
export async function inviteAdminUser(): Promise<{ success: boolean; error?: string }> {
  return {
    success: false,
    error: 'Creating new admin accounts requires a server-side call (Edge Function) using the service_role key — not implemented client-side for security.',
  };
}
