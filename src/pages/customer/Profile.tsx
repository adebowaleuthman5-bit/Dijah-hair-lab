import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function Profile() {
  const { customer, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(customer?.fullName ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFullName(customer?.fullName ?? '');
    setEmail(customer?.email ?? '');
    setPhone(customer?.phone ?? '');
  }, [customer?.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium text-ink">Profile</h1>

      <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
        <Field label="Full Name" value={fullName} onChange={setFullName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Phone Number" type="tel" value={phone} onChange={setPhone} required />

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit">Save Changes</Button>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}
