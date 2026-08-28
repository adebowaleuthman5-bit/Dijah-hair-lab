import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import StatusPill from '@/components/admin/StatusPill';
import { useAdminOps } from '@/hooks/useAdminOps';
import { getServiceById } from '@/data/services';
import { toISODate } from '@/data/availability';
import { Booking } from '@/types';

type ViewMode = 'day' | 'week' | 'month';

export default function AdminCalendar() {
  const { bookings } = useAdminOps();
  const [view, setView] = useState<ViewMode>('month');
  const [cursor, setCursor] = useState(new Date());
  const [dayModal, setDayModal] = useState<{ date: string; bookings: Booking[] } | null>(null);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      const list = map.get(b.date) ?? [];
      list.push(b);
      map.set(b.date, list);
    });
    return map;
  }, [bookings]);

  const shift = (amount: number) => {
    const next = new Date(cursor);
    if (view === 'day') next.setDate(next.getDate() + amount);
    else if (view === 'week') next.setDate(next.getDate() + amount * 7);
    else next.setMonth(next.getMonth() + amount);
    setCursor(next);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-ink-500">Visual overview of all appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-sm border border-ink/15">
            {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide capitalize ${
                  view === v ? 'bg-ink text-cream' : 'text-ink-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => shift(-1)} className="rounded-sm border border-ink/15 p-2 text-ink-700 hover:border-ink">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => shift(1)} className="rounded-sm border border-ink/15 p-2 text-ink-700 hover:border-ink">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {view === 'month' && <MonthView cursor={cursor} bookingsByDate={bookingsByDate} onSelectDay={setDayModal} />}
      {view === 'week' && <WeekView cursor={cursor} bookingsByDate={bookingsByDate} onSelectDay={setDayModal} />}
      {view === 'day' && <DayView cursor={cursor} bookingsByDate={bookingsByDate} />}

      <Modal open={!!dayModal} onClose={() => setDayModal(null)} title={dayModal?.date ?? ''}>
        {dayModal && <DayBookingsList bookings={dayModal.bookings} />}
      </Modal>
    </div>
  );
}

function MonthView({
  cursor,
  bookingsByDate,
  onSelectDay,
}: {
  cursor: Date;
  bookingsByDate: Map<string, Booking[]>;
  onSelectDay: (v: { date: string; bookings: Booking[] }) => void;
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];

  return (
    <div className="rounded-sm border border-ink/10 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-ink-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <span key={idx} />;
          const iso = toISODate(date);
          const dayBookings = bookingsByDate.get(iso) ?? [];
          return (
            <button
              key={iso}
              onClick={() => dayBookings.length > 0 && onSelectDay({ date: iso, bookings: dayBookings })}
              className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-sm p-1 text-xs ${
                dayBookings.length > 0 ? 'bg-gold-50 hover:bg-gold-100' : 'text-ink-500'
              }`}
            >
              <span className="font-medium text-ink">{date.getDate()}</span>
              {dayBookings.length > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 text-[9px] font-bold text-white">{dayBookings.length}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  cursor,
  bookingsByDate,
  onSelectDay,
}: {
  cursor: Date;
  bookingsByDate: Map<string, Booking[]>;
  onSelectDay: (v: { date: string; bookings: Booking[] }) => void;
}) {
  const startOfWeek = new Date(cursor);
  startOfWeek.setDate(cursor.getDate() - cursor.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((date) => {
        const iso = toISODate(date);
        const dayBookings = bookingsByDate.get(iso) ?? [];
        return (
          <button
            key={iso}
            onClick={() => dayBookings.length > 0 && onSelectDay({ date: iso, bookings: dayBookings })}
            className="flex flex-col gap-2 rounded-sm border border-ink/10 bg-white p-3 text-left"
          >
            <span className="text-[10px] font-semibold uppercase text-ink-500">
              {date.toLocaleDateString('en-GB', { weekday: 'short' })}
            </span>
            <span className="font-display text-lg text-ink">{date.getDate()}</span>
            <span className="text-xs text-ink-500">{dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}</span>
          </button>
        );
      })}
    </div>
  );
}

function DayView({ cursor, bookingsByDate }: { cursor: Date; bookingsByDate: Map<string, Booking[]> }) {
  const iso = toISODate(cursor);
  const dayBookings = (bookingsByDate.get(iso) ?? []).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="rounded-sm border border-ink/10 bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-ink">
        {cursor.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <DayBookingsList bookings={dayBookings} />
    </div>
  );
}

function DayBookingsList({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-500">No bookings for this day.</p>;
  }
  return (
    <div className="flex flex-col divide-y divide-ink/10">
      {bookings.map((b) => {
        const service = getServiceById(b.serviceId);
        return (
          <div key={b.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">
                {b.time} · {b.customer.fullName}
              </p>
              <p className="text-xs text-ink-500">{service?.name}</p>
            </div>
            <StatusPill status={b.status} />
          </div>
        );
      })}
    </div>
  );
}
