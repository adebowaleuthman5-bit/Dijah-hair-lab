import { BookingDraft } from '@/types';
import { getDemoAvailability } from '@/data/availability';
import { formatReadableDate } from '@/utils/format';

interface Props {
  draft: BookingDraft;
  onSelect: (time: string) => void;
}

export default function TimeStep({ draft, onSelect }: Props) {
  if (!draft.date) {
    return <p className="text-sm text-ink-500">Please select a date first.</p>;
  }

  const availability = getDemoAvailability(new Date(draft.date + 'T00:00:00'));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Select a Time</h2>
        <p className="mt-1 text-sm text-ink-500">Available slots for {formatReadableDate(draft.date)}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {availability.slots.map((slot) => {
          const selected = draft.time === slot.time;
          return (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => onSelect(slot.time)}
              className={`rounded-sm border py-3 text-sm font-medium transition-colors ${
                !slot.available
                  ? 'cursor-not-allowed border-ink/10 text-ink/25 line-through'
                  : selected
                    ? 'border-rose-600 bg-rose-600 text-white'
                    : 'border-ink/15 text-ink hover:border-rose-600'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
