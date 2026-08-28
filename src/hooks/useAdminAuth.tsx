import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AdminUser } from '@/types';
import { adminUsers } from '@/data/admins';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as authService from '@/services/supabase/authService';

interface AdminAuthContextValue {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const SESSION_KEY = 'dhl_admin_session';

// Same dual demo/live pattern as useAuth.tsx (customer account) — see the
// comment there for the full rationale. login() is async here (unlike the
// original demo-only version) so it can await a real Supabase call when
// configured; in demo mode it just resolves immediately.
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      authService.fetchCurrentAdmin().then((a) => a && setAdmin(a));
      return;
    }
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const persist = (next: AdminUser | null) => {
    setAdmin(next);
    if (!isSupabaseConfigured) {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else localStorage.removeItem(SESSION_KEY);
    }
  };

  const login: AdminAuthContextValue['login'] = async (email, password) => {
    if (isSupabaseConfigured) {
      const result = await authService.signInAdmin(email, password);
      if (result.admin) persist(result.admin);
      return { success: !!result.admin, error: result.error };
    }
    // DEMO MODE: any seeded admin email + any password
    const found = adminUsers.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { success: false, error: 'No admin account found with that email.' };
    if (!found.active) return { success: false, error: 'This admin account has been deactivated.' };
    persist({ ...found, lastLogin: new Date().toISOString() });
    return { success: true };
  };

  const logout = () => {
    persist(null);
    if (isSupabaseConfigured) authService.signOutAdmin();
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
