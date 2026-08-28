import { useState } from 'react';
import { Plus, X, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAdminOps } from '@/hooks/useAdminOps';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminAvailability() {
  const { availability, updateAvailability } = useAdminOps();
  const [form, setForm] = useState(availability);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    setForm((prev) => ({ ...prev, blockedDates: [...prev.blockedDates, newBlockedDate] }));
    setNewBlockedDate('');
  };

  const removeBlockedDate = (date: string) => {
    setForm((prev) => ({ ...prev, blockedDates: prev.blockedDates.filter((d) => d !== date) }));
  };

  const handleSave = () => {
    updateAvailability(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Availability</h1>
        <p className="mt-1 text-sm text-ink-500">
          Configure booking hours, working days and blocked dates. These settings represent the
          rules the public booking calendar would follow with a live backend.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-sm border border-ink/10 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Opening Time" value={form.openingTime} onChange={(v) => setForm((p) => ({ ...p, openingTime: v }))} />
          <Field label="Closing Time" value={form.closingTime} onChange={(v) => setForm((p) => ({ ...p, closingTime: v }))} />
          <Field label="Break Start" value={form.breakStart ?? ''} onChange={(v) => setForm((p) => ({ ...p, breakStart: v }))} />
          <Field label="Break End" value={form.breakEnd ?? ''} onChange={(v) => setForm((p) => ({ ...p, breakEnd: v }))} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-700">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  form.workingDays.includes(day) ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-500'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Appointment Duration (minutes)</label>
            <input
              type="number"
              value={form.appointmentDurationMinutes}
              onChange={(e) => setForm((p) => ({ ...p, appointmentDurationMinutes: Number(e.target.value) }))}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Max Bookings Per Slot</label>
            <input
              type="number"
              value={form.maxBookingsPerSlot}
              onChange={(e) => setForm((p) => ({ ...p, maxBookingsPerSlot: Number(e.target.value) }))}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.homeServiceAvailable}
            onChange={(e) => setForm((p) => ({ ...p, homeServiceAvailable: e.target.checked }))}
            className="h-4 w-4"
          />
          Home service available
        </label>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-700">Blocked Dates</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
            <button onClick={addBlockedDate} className="flex items-center gap-1 rounded-sm bg-ink px-4 py-2.5 text-xs font-semibold uppercase text-cream">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.blockedDates.map((date) => (
              <span key={date} className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700">
                {date}
                <button onClick={() => removeBlockedDate(date)} aria-label="Remove">
                  <X size={12} />
                </button>
              </span>
            ))}
            {form.blockedDates.length === 0 && <span className="text-xs text-ink-500">No blocked dates.</span>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-700">Holiday Dates</label>
          <div className="flex flex-wrap gap-2">
            {form.holidayDates.map((date) => (
              <span key={date} className="rounded-full bg-gold-50 px-3 py-1 text-xs text-gold-700">
                {date}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>Save Availability</Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}
