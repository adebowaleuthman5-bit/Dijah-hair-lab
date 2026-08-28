import { DayAvailability } from '@/types';

// Demo availability generator. In production this is replaced by data
// coming from /admin/availability (opening hours, blocked dates, max
// bookings per slot) via a real backend — the shape below is designed
// to match that future source directly.
const DEMO_SLOT_TIMES = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

// Sundays are closed in this demo; everything else uses the standard slots
// with a couple of slots pre-marked as fully booked to demonstrate disabled
// states in the UI.
export function getDemoAvailability(date: Date): DayAvailability {
  const iso = toISODate(date);
  const isSunday = date.getDay() === 0;

  if (isSunday) {
    return { date: iso, isOpen: false, slots: [] };
  }

  const dayOfMonth = date.getDate();
  const slots = DEMO_SLOT_TIMES.map((time, idx) => {
    // Deterministic demo pattern: block one slot every few days so the
    // calendar visibly demonstrates unavailable-slot handling.
    const isBlocked = (dayOfMonth + idx) % 7 === 0;
    return {
      time,
      available: !isBlocked,
      maxBookings: 1,
      currentBookings: isBlocked ? 1 : 0,
    };
  });

  return { date: iso, isOpen: true, slots };
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// No bookings can be made for dates in the past.
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}
