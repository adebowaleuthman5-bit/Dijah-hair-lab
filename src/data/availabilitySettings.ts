import { AvailabilitySettings } from '@/types';

export const defaultAvailabilitySettings: AvailabilitySettings = {
  openingTime: '9:00 AM',
  closingTime: '5:00 PM',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  breakStart: '1:00 PM',
  breakEnd: '2:00 PM',
  appointmentDurationMinutes: 60,
  maxBookingsPerSlot: 1,
  blockedDates: [],
  holidayDates: ['2026-12-25', '2026-01-01'],
  homeServiceAvailable: true,
};
