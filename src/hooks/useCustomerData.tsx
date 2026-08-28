import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Booking, SavedAddress, CustomerNotification } from '@/types';
import { demoAddresses } from '@/data/customers';
import { demoBookingHistory } from '@/data/bookings';
import { demoNotifications } from '@/data/notifications';
import * as customerService from '@/services/customerService';
import * as customerDataService from '@/services/supabase/customerDataService';
import * as bookingsService from '@/services/supabase/bookingsService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface CustomerDataContextValue {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, date: string, time: string) => void;

  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  notifications: CustomerNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const CustomerDataContext = createContext<CustomerDataContextValue | undefined>(undefined);

// Dual demo/live pattern (see useAuth.tsx). Depends on useAuth() to know
// which customer's data to load in live mode — must be nested inside
// AuthProvider in App.tsx, which it already is.
export function CustomerDataProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(demoBookingHistory);
  const [addresses, setAddresses] = useState<SavedAddress[]>(demoAddresses);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(demoNotifications);

  useEffect(() => {
    if (!isSupabaseConfigured || !customer) return;
    customerDataService.fetchSavedAddresses(customer.id).then((a) => a && setAddresses(a));
    customerDataService.fetchCustomerNotifications(customer.id).then((n) => n && setNotifications(n));
    bookingsService.fetchBookingsForCustomer(customer.id).then((b) => b && setBookings(b));
  }, [customer?.id]);

  const addBooking = (booking: Booking) => setBookings((prev) => [booking, ...prev]);

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => customerService.cancelBooking(prev, bookingId));
    if (isSupabaseConfigured) bookingsService.updateBookingStatusRemote(bookingId, 'cancelled');
  };

  const handleRescheduleBooking = (bookingId: string, date: string, time: string) => {
    setBookings((prev) => customerService.rescheduleBooking(prev, bookingId, date, time));
    if (isSupabaseConfigured) bookingsService.rescheduleBookingRemote(bookingId, date, time);
  };

  const handleAddAddress = (address: Omit<SavedAddress, 'id'>) => {
    setAddresses((prev) => {
      const updated = customerService.addAddress(prev, address);
      if (isSupabaseConfigured && customer) {
        const newAddress = updated[updated.length - 1];
        customerDataService.upsertSavedAddressRemote(customer.id, newAddress);
      }
      return updated;
    });
  };

  const handleRemoveAddress = (addressId: string) => {
    setAddresses((prev) => customerService.removeAddress(prev, addressId));
    if (isSupabaseConfigured) customerDataService.deleteSavedAddressRemote(addressId);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses((prev) => {
      const updated = customerService.setDefaultAddress(prev, addressId);
      if (isSupabaseConfigured && customer) {
        updated.forEach((a) => customerDataService.upsertSavedAddressRemote(customer.id, a));
      }
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (isSupabaseConfigured) customerDataService.markNotificationReadRemote(id, true);
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isSupabaseConfigured) notifications.forEach((n) => customerDataService.markNotificationReadRemote(n.id, true));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <CustomerDataContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking: handleCancelBooking,
        rescheduleBooking: handleRescheduleBooking,
        addresses,
        addAddress: handleAddAddress,
        removeAddress: handleRemoveAddress,
        setDefaultAddress: handleSetDefaultAddress,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
}

export function useCustomerData() {
  const ctx = useContext(CustomerDataContext);
  if (!ctx) throw new Error('useCustomerData must be used within CustomerDataProvider');
  return ctx;
}
