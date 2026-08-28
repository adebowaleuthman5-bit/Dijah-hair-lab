import { useState } from 'react';
import { X } from 'lucide-react';
import { Booking, BookingDraft } from '@/types';
import DateStep from '@/components/booking/DateStep';
import TimeStep from '@/components/booking/TimeStep';
import Button from '@/components/ui/Button';

interface Props {
  booking: Booking;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

export default function RescheduleModal({ booking, onClose, onConfirm }: Props) {
  const [draft, setDraft] = useState<BookingDraft>({ date: undefined, time: undefined });

  const handleConfirm = () => {
    if (draft.date && draft.time) {
      onConfirm(draft.date, draft.time);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-sm bg-white p-6 sm:rounded-sm sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-medium text-ink">Reschedule Booking</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink-500 hover:text-rose-600">
            <X size={20} />
          </button>
        </div>
        <p className="mb-6 text-sm text-ink-500">
          Currently scheduled for {booking.date} at {booking.time}. Choose a new date and time below.
        </p>

        <DateStep draft={draft} onSelect={(date) => setDraft((prev) => ({ ...prev, date, time: undefined }))} />
        {draft.date && (
          <div className="mt-6">
            <TimeStep draft={draft} onSelect={(time) => setDraft((prev) => ({ ...prev, time }))} />
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600">
            Cancel
          </button>
          <Button onClick={handleConfirm} disabled={!draft.date || !draft.time}>
            Confirm New Time
          </Button>
        </div>
      </div>
    </div>
  );
}
