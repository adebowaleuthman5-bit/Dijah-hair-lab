import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Customer, AdminUser, AdminRole } from '@/types';

// NOTE: Supabase Auth has one global session per browser — there's no
// built-in concept of "signed in as a customer AND separately as an
// admin" the way the current demo mode's two separate localStorage keys
// allow. In practice this is fine (the same person is rarely both), but
// if a browser is signed in as an admin, fetchCurrentCustomer() below
// will simply find no matching customers row and return null, and vice
// versa — each lookup is scoped by table, not by "login type".

// ============================================================
// Customer auth
// ============================================================

export async function signUpCustomer(details: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ customer: Customer | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { customer: null, error: 'Supabase is not configured.' };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: details.email,
    password: details.password,
  });
  if (authError || !authData.user) {
    return { customer: null, error: authError?.message ?? 'Sign up failed.' };
  }

  const { data: row, error: insertError } = await supabase
    .from('customers')
    .insert({
      id: authData.user.id,
      full_name: details.fullName,
      email: details.email,
      phone: details.phone,
    })
    .select()
    .single();

  if (insertError || !row) {
    return { customer: null, error: insertError?.message ?? 'Could not create customer profile.' };
  }

  return { customer: mapCustomerRow(row) };
}

export async function signInCustomer(
  email: string,
  password: string
): Promise<{ customer: Customer | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { customer: null, error: 'Supabase is not configured.' };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError || !authData.user) {
    return { customer: null, error: authError?.message ?? 'Invalid email or password.' };
  }

  const { data: row, error: fetchError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (fetchError || !row) {
    return { customer: null, error: 'Signed in, but no customer profile was found for this account.' };
  }

  return { customer: mapCustomerRow(row) };
}

export async function fetchCurrentCustomer(): Promise<Customer | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return null;

  const { data: row } = await supabase.from('customers').select('*').eq('id', session.session.user.id).single();
  return row ? mapCustomerRow(row) : null;
}

export async function updateCustomerProfile(
  id: string,
  updates: Partial<Pick<Customer, 'fullName' | 'email' | 'phone'>>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };

  const { error } = await supabase
    .from('customers')
    .update({
      ...(updates.fullName !== undefined ? { full_name: updates.fullName } : {}),
      ...(updates.email !== undefined ? { email: updates.email } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
    })
    .eq('id', id);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function signOutCustomer(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

// Sends a real password-reset email via Supabase Auth. The link inside it
// brings the person back to /reset-password with a temporary recovery
// session already attached (Supabase's client detects the token in the
// URL automatically) — see pages/customer/ResetPassword.tsx, which is
// where they actually set a new password.
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  // Supabase intentionally doesn't reveal whether the email exists (to
  // avoid leaking which addresses have accounts) — a "success" here just
  // means the request was accepted, not that an account was found.
  return error ? { success: false, error: error.message } : { success: true };
}

// Called from the /reset-password page once the person has followed the
// email link and is in a valid recovery session.
export async function updatePasswordAfterReset(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? { success: false, error: error.message } : { success: true };
}

function mapCustomerRow(row: any): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    registeredAt: row.registered_at,
  };
}

// ============================================================
// Admin auth
// ============================================================

export async function signInAdmin(email: string, password: string): Promise<{ admin: AdminUser | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { admin: null, error: 'Supabase is not configured.' };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError || !authData.user) {
    return { admin: null, error: authError?.message ?? 'Invalid email or password.' };
  }

  const { data: row, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (fetchError || !row) {
    return { admin: null, error: 'Signed in, but this account has no admin access.' };
  }
  if (!row.active) {
    return { admin: null, error: 'This admin account has been deactivated.' };
  }

  await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', row.id);

  return { admin: mapAdminRow(row) };
}

export async function fetchCurrentAdmin(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return null;

  const { data: row } = await supabase.from('admin_users').select('*').eq('id', session.session.user.id).single();
  return row ? mapAdminRow(row) : null;
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

function mapAdminRow(row: any): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as AdminRole,
    active: row.active,
    lastLogin: row.last_login ?? undefined,
  };
}
