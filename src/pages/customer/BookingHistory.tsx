import { useState } from 'react';
import { useCustomerData } from '@/hooks/useCustomerData';
import BookingRow from '@/components/customer/BookingRow';
import Button from '@/components/ui/Button';
import { BookingStatus } from '@/types';

const filters: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function BookingHistory() {
  const { bookings } = useCustomerData();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filtered = bookings
    .filter((b) => filter === 'all' || b.status === filter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">My Bookings</h1>
        <Button to="/booking" size="sm">
          Book New
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              filter === f.value ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-700 hover:border-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">No bookings in this category yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
