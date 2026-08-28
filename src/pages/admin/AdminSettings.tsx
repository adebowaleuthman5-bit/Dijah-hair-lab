import { useState, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { businessSettings, updateBusinessSettings } from '@/data/business';

export default function AdminSettings() {
  const [form, setForm] = useState({ ...businessSettings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateBusinessSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Business-wide configuration used across the public site.</p>
      </div>

      <Section title="Business Information">
        <Field label="Business Name" value={form.businessName} onChange={(v) => setForm((p) => ({ ...p, businessName: v }))} />
        <Field label="Tagline" value={form.tagline} onChange={(v) => setForm((p) => ({ ...p, tagline: v }))} />
      </Section>

      <Section title="Location">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Address Line" value={form.addressLine} onChange={(v) => setForm((p) => ({ ...p, addressLine: v }))} />
          <Field label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
          <Field label="State" value={form.state} onChange={(v) => setForm((p) => ({ ...p, state: v }))} />
          <Field label="Country" value={form.country} onChange={(v) => setForm((p) => ({ ...p, country: v }))} />
        </div>
      </Section>

      <Section title="Contact Information">
        <Field label="WhatsApp Number" value={form.whatsappNumber} onChange={(v) => setForm((p) => ({ ...p, whatsappNumber: v }))} />
        <Field
          label="Contact Email (optional)"
          value={form.contactEmail ?? ''}
          onChange={(v) => setForm((p) => ({ ...p, contactEmail: v || undefined }))}
          placeholder="Not yet set"
        />
      </Section>

      <Section title="Booking Settings">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={!!form.notifyOnNewBooking}
            onChange={(e) => setForm((p) => ({ ...p, notifyOnNewBooking: e.target.checked }))}
            className="h-4 w-4"
          />
          Notify admin on new booking
        </label>
        <p className="text-[11px] text-ink-500">
          Fine-grained hours, blocked dates and slot limits live under Availability.
        </p>
      </Section>

      <Section title="Home Service">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.homeServiceEnabled}
            onChange={(e) => setForm((p) => ({ ...p, homeServiceEnabled: e.target.checked }))}
            className="h-4 w-4"
          />
          Home service enabled on public booking flow
        </label>
      </Section>

      <Section title="SEO">
        <Field label="SEO Title" value={form.seoTitle ?? ''} onChange={(v) => setForm((p) => ({ ...p, seoTitle: v }))} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">SEO Description</label>
          <textarea
            rows={3}
            value={form.seoDescription ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
            className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
          />
        </div>
      </Section>

      <Section title="Notifications">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={!!form.notifyOnNewSubscriber}
            onChange={(e) => setForm((p) => ({ ...p, notifyOnNewSubscriber: e.target.checked }))}
            className="h-4 w-4"
          />
          Notify admin on new newsletter subscriber
        </label>
      </Section>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>Save Settings</Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={16} /> Saved — reflected across the public site
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-ink/10 bg-white p-6">
      <h2 className="font-display text-base font-medium text-ink">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}
