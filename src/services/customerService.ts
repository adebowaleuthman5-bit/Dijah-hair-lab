import { Booking, BookingStatus, Customer, SavedAddress } from '@/types';

// All functions here are demo/in-memory today. Swap the bodies for real API
// calls (e.g. Supabase) later — callers (the useCustomer hook) don't need to
// change since the function signatures already match what a real backend
// would need.

export function updateCustomerProfile(current: Customer, updates: Partial<Customer>): Customer {
  return { ...current, ...updates };
}

export function addAddress(addresses: SavedAddress[], address: Omit<SavedAddress, 'id'>): SavedAddress[] {
  const newAddress: SavedAddress = { ...address, id: `addr-${Date.now()}` };
  const updated = newAddress.isDefault
    ? addresses.map((a) => ({ ...a, isDefault: false }))
    : addresses;
  return [...updated, newAddress];
}

export function removeAddress(addresses: SavedAddress[], addressId: string): SavedAddress[] {
  return addresses.filter((a) => a.id !== addressId);
}

export function setDefaultAddress(addresses: SavedAddress[], addressId: string): SavedAddress[] {
  return addresses.map((a) => ({ ...a, isDefault: a.id === addressId }));
}

export function cancelBooking(bookings: Booking[], bookingId: string): Booking[] {
  return bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b));
}

export function rescheduleBooking(
  bookings: Booking[],
  bookingId: string,
  newDate: string,
  newTime: string
): Booking[] {
  return bookings.map((b) =>
    b.id === bookingId ? { ...b, date: newDate, time: newTime, status: 'pending' as BookingStatus } : b
  );
}
