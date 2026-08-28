import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Customer } from '@/types';
import { demoCustomer } from '@/data/customers';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as authService from '@/services/supabase/authService';

const SESSION_KEY = 'dhl_demo_session';

interface AuthContextValue {
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (details: { fullName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Pick<Customer, 'fullName' | 'email' | 'phone'>>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Two modes, same public interface:
// - Demo mode (no Supabase configured): everything below the "DEMO MODE"
//   comments — a fake session persisted to localStorage, accepting the
//   seeded demo account.
// - Live mode (Supabase configured): real Supabase Auth + the `customers`
//   table, via src/services/supabase/authService.ts.
// Every consuming component just calls useAuth() and gets the same shape
// back either way.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      authService.fetchCurrentCustomer().then((c) => c && setCustomer(c));
      return;
    }
    // DEMO MODE: hydrate from localStorage
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setCustomer(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const persist = (c: Customer | null) => {
    setCustomer(c);
    if (!isSupabaseConfigured) {
      if (c) localStorage.setItem(SESSION_KEY, JSON.stringify(c));
      else localStorage.removeItem(SESSION_KEY);
    }
  };

  const login: AuthContextValue['login'] = async (email, password) => {
    if (isSupabaseConfigured) {
      const result = await authService.signInCustomer(email, password);
      if (result.customer) persist(result.customer);
      return { success: !!result.customer, error: result.error };
    }
    // DEMO MODE: accept the seeded demo email, any password
    if (email.trim().toLowerCase() === demoCustomer.email.toLowerCase()) {
      persist(demoCustomer);
      return { success: true };
    }
    return {
      success: false,
      error: `No demo account found for that email. Try ${demoCustomer.email}, or register a new account.`,
    };
  };

  const register: AuthContextValue['register'] = async ({ fullName, email, phone, password }) => {
    if (isSupabaseConfigured) {
      const result = await authService.signUpCustomer({ fullName, email, phone, password });
      if (result.customer) persist(result.customer);
      return { success: !!result.customer, error: result.error };
    }
    // DEMO MODE: "create" a session immediately, no real account
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      fullName,
      email,
      phone,
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    persist(newCustomer);
    return { success: true };
  };

  const logout = () => {
    persist(null);
    if (isSupabaseConfigured) authService.signOutCustomer();
  };

  const updateProfile: AuthContextValue['updateProfile'] = (updates) => {
    setCustomer((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      if (isSupabaseConfigured) {
        authService.updateCustomerProfile(prev.id, updates);
      } else {
        localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ customer, isAuthenticated: !!customer, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
