import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  PaymentRecord,
  AdminUser,
  CustomerDirectoryEntry,
  AvailabilitySettings,
} from '@/types';
import { allDemoBookings } from '@/data/allBookings';
import { paymentRecords as seedPayments } from '@/data/payments';
import { adminUsers as seedAdminUsers } from '@/data/admins';
import { demoCustomer } from '@/data/customers';
import { defaultAvailabilitySettings } from '@/data/availabilitySettings';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as bookingsService from '@/services/supabase/bookingsService';
import * as peopleService from '@/services/supabase/peopleService';
import * as settingsService from '@/services/supabase/settingsService';

interface AdminOpsContextValue {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  rescheduleBooking: (id: string, date: string, time: string) => void;

  payments: PaymentRecord[];
  updatePaymentStatus: (id: string, status: PaymentRecord['status']) => void;

  customers: CustomerDirectoryEntry[];
  deactivateCustomer: (id: string) => void;
  reactivateCustomer: (id: string) => void;

  adminUsers: AdminUser[];
  addAdminUser: (user: AdminUser) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  removeAdminUser: (id: string) => void;

  availability: AvailabilitySettings;
  updateAvailability: (updates: Partial<AvailabilitySettings>) => void;
}

const AdminOpsContext = createContext<AdminOpsContextValue | undefined>(undefined);

// Dual demo/live pattern (see useAuth.tsx for the full rationale): state
// initializes from the bundled demo data for an instant first render, then
// — if Supabase is configured — an effect fetches the real rows and
// replaces it. Every mutation updates local state immediately (optimistic)
// and fires the matching Supabase write in the background when live.
export function AdminOpsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(allDemoBookings);
  const [payments, setPayments] = useState<PaymentRecord[]>(seedPayments);
  const [adminUsersState, setAdminUsersState] = useState<AdminUser[]>(seedAdminUsers);
  const [availability, setAvailability] = useState<AvailabilitySettings>(defaultAvailabilitySettings);
  const [deactivatedCustomerIds, setDeactivatedCustomerIds] = useState<string[]>([]);
  const [liveCustomers, setLiveCustomers] = useState<CustomerDirectoryEntry[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    bookingsService.fetchAllBookings().then((b) => b && setBookings(b));
    bookingsService.fetchAllPayments().then((p) => p && setPayments(p));
    peopleService.fetchAdminUsers().then((u) => u && setAdminUsersState(u));
    peopleService.fetchCustomerDirectory().then((c) => c && setLiveCustomers(c));
    settingsService.fetchAvailabilitySettings().then((a) => a && setAvailability(a));
  }, []);

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    if (isSupabaseConfigured) bookingsService.updateBookingStatusRemote(id, status);
  };

  const rescheduleBooking = (id: string, date: string, time: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, date, time, status: 'pending' } : b)));
    if (isSupabaseConfigured) bookingsService.rescheduleBookingRemote(id, date, time);
  };

  const updatePaymentStatus = (id: string, status: PaymentRecord['status']) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    if (isSupabaseConfigured) bookingsService.updatePaymentStatusRemote(id, status);
  };

  // DEMO MODE derives a customer directory from bookings client-side
  // (grouped by email). LIVE MODE uses liveCustomers, fetched from the
  // customer_directory SQL view, which does the same aggregation in the
  // database instead — see supabase/migrations/0004_triggers_and_views.sql.
  const demoDerivedCustomers: CustomerDirectoryEntry[] = useMemo(() => {
    const byEmail = new Map<string, CustomerDirectoryEntry>();

    for (const booking of bookings) {
      const email = booking.customer.email.toLowerCase();
      const existing = byEmail.get(email);
      const isRegistered = email === demoCustomer.email.toLowerCase();

      if (existing) {
        existing.totalBookings += 1;
        if (!existing.lastBookingDate || booking.date > existing.lastBookingDate) {
          existing.lastBookingDate = booking.date;
        }
      } else {
        byEmail.set(email, {
          id: `dir-${email}`,
          fullName: booking.customer.fullName,
          email: booking.customer.email,
          phone: booking.customer.phone,
          registeredAt: isRegistered ? demoCustomer.registeredAt : undefined,
          totalBookings: 1,
          lastBookingDate: booking.date,
          status: deactivatedCustomerIds.includes(`dir-${email}`) ? 'deactivated' : 'active',
        });
      }
    }

    return Array.from(byEmail.values()).sort(
      (a, b) => (b.lastBookingDate ?? '').localeCompare(a.lastBookingDate ?? '')
    );
  }, [bookings, deactivatedCustomerIds]);

  const customers = isSupabaseConfigured && liveCustomers ? liveCustomers : demoDerivedCustomers;

  const deactivateCustomer = (id: string) => {
    setDeactivatedCustomerIds((prev) => [...prev, id]);
    setLiveCustomers((prev) => prev?.map((c) => (c.id === id ? { ...c, status: 'deactivated' } : c)) ?? prev);
    if (isSupabaseConfigured) {
      const target = customers.find((c) => c.id === id);
      // Guests (no registeredAt) have no customers row to update — only a
      // trail of bookings — so there's nothing to flip server-side for them.
      if (target?.registeredAt) peopleService.setCustomerStatusRemote(id, 'deactivated');
    }
  };

  const reactivateCustomer = (id: string) => {
    setDeactivatedCustomerIds((prev) => prev.filter((existingId) => existingId !== id));
    setLiveCustomers((prev) => prev?.map((c) => (c.id === id ? { ...c, status: 'active' } : c)) ?? prev);
    if (isSupabaseConfigured) {
      const target = customers.find((c) => c.id === id);
      if (target?.registeredAt) peopleService.setCustomerStatusRemote(id, 'active');
    }
  };

  const addAdminUser = (user: AdminUser) => {
    setAdminUsersState((prev) => [user, ...prev]);
    // Real admin creation needs a server-side call (service_role key) —
    // see peopleService.inviteAdminUser() for why this can't happen from
    // the browser. In live mode this optimistic row won't persist until
    // that server-side piece exists.
  };
  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsersState((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (isSupabaseConfigured) peopleService.updateAdminUserRemote(id, updates);
  };
  const removeAdminUser = (id: string) => {
    setAdminUsersState((prev) => prev.filter((u) => u.id !== id));
    if (isSupabaseConfigured) peopleService.removeAdminUserRemote(id);
  };

  const updateAvailability = (updates: Partial<AvailabilitySettings>) => {
    setAvailability((prev) => ({ ...prev, ...updates }));
    if (isSupabaseConfigured) settingsService.updateAvailabilitySettingsRemote(updates);
  };

  return (
    <AdminOpsContext.Provider
      value={{
        bookings,
        updateBookingStatus,
        rescheduleBooking,
        payments,
        updatePaymentStatus,
        customers,
        deactivateCustomer,
        reactivateCustomer,
        adminUsers: adminUsersState,
        addAdminUser,
        updateAdminUser,
        removeAdminUser,
        availability,
        updateAvailability,
      }}
    >
      {children}
    </AdminOpsContext.Provider>
  );
}

export function useAdminOps() {
  const ctx = useContext(AdminOpsContext);
  if (!ctx) throw new Error('useAdminOps must be used within AdminOpsProvider');
  return ctx;
}
