import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingDraft } from '@/types';
import { getDemoAvailability, isPastDate, toISODate } from '@/data/availability';

interface Props {
  draft: BookingDraft;
  onSelect: (date: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DateStep({ draft, onSelect }: Props) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const monthLabel = viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const canGoBack = !(year === new Date().getFullYear() && month === new Date().getMonth());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Select a Date</h2>
        <p className="mt-1 text-sm text-ink-500">We&apos;re closed on Sundays.</p>
      </div>

      <div className="max-w-md rounded-sm border border-ink/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            disabled={!canGoBack}
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="text-ink-500 hover:text-rose-600 disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-sm font-semibold text-ink">{monthLabel}</p>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="text-ink-500 hover:text-rose-600"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1 text-[10px] font-semibold uppercase text-ink-500">
              {d}
            </span>
          ))}
          {cells.map((date, idx) => {
            if (!date) return <span key={idx} />;
            const iso = toISODate(date);
            const availability = getDemoAvailability(date);
            const disabled = isPastDate(date) || !availability.isOpen;
            const selected = draft.date === iso;

            return (
              <button
                key={iso}
                disabled={disabled}
                onClick={() => onSelect(iso)}
                className={`aspect-square rounded-sm text-xs font-medium transition-colors ${
                  disabled
                    ? 'cursor-not-allowed text-ink/20'
                    : selected
                      ? 'bg-rose-600 text-white'
                      : 'text-ink hover:bg-gold-50'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
