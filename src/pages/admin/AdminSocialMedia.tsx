import { useState } from 'react';
import { CheckCircle2, Music2, Instagram, Facebook, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { businessSettings, updateBusinessSettings } from '@/data/business';

export default function AdminSocialMedia() {
  const [form, setForm] = useState({
    tiktokHandle: businessSettings.tiktokHandle,
    instagramHandle: businessSettings.instagramHandle ?? '',
    facebookHandle: businessSettings.facebookHandle ?? '',
    whatsappNumber: businessSettings.whatsappNumber,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateBusinessSettings({
      tiktokHandle: form.tiktokHandle,
      instagramHandle: form.instagramHandle || undefined,
      facebookHandle: form.facebookHandle || undefined,
      whatsappNumber: form.whatsappNumber,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Social Media</h1>
        <p className="mt-1 text-sm text-ink-500">Manage the social links shown across the public site.</p>
      </div>

      <div className="flex flex-col gap-5 rounded-sm border border-ink/10 bg-white p-6">
        <Field icon={Music2} label="TikTok Handle" value={form.tiktokHandle} onChange={(v) => setForm((p) => ({ ...p, tiktokHandle: v }))} prefix="@" />
        <Field icon={Phone} label="WhatsApp Number" value={form.whatsappNumber} onChange={(v) => setForm((p) => ({ ...p, whatsappNumber: v }))} />
        <Field
          icon={Instagram}
          label="Instagram Handle (optional)"
          value={form.instagramHandle}
          onChange={(v) => setForm((p) => ({ ...p, instagramHandle: v }))}
          prefix="@"
          placeholder="Not yet set"
        />
        <Field
          icon={Facebook}
          label="Facebook Page (optional)"
          value={form.facebookHandle}
          onChange={(v) => setForm((p) => ({ ...p, facebookHandle: v }))}
          placeholder="Not yet set"
        />
        <p className="text-[11px] text-ink-500">
          Instagram and Facebook are left blank until the business confirms real accounts — no
          handles are invented here.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave}>Save Changes</Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  prefix,
  placeholder,
}: {
  icon: typeof Music2;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-700">
        <Icon size={13} /> {label}
      </label>
      <div className="flex items-center rounded-sm border border-ink/15 focus-within:border-gold-500">
        {prefix && <span className="pl-4 text-sm text-ink-500">{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}
