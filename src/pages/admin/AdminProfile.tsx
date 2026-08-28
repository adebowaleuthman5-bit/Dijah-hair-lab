import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminOps } from '@/hooks/useAdminOps';
import { roleLabels } from '@/data/admins';

export default function AdminProfile() {
  const { admin } = useAdminAuth();
  const { updateAdminUser } = useAdminOps();
  const [name, setName] = useState(admin?.name ?? '');
  const [email, setEmail] = useState(admin?.email ?? '');
  const [saved, setSaved] = useState(false);

  if (!admin) return null;

  const handleSave = () => {
    updateAdminUser(admin.id, { name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your own admin account details.</p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-sm border border-ink/10 bg-white p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-xl font-bold text-ink">
          {admin.name.charAt(0)}
        </span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold uppercase text-violet-600">
          {roleLabels[admin.role]}
        </span>
      </div>

      <div className="flex flex-col gap-4 rounded-sm border border-ink/10 bg-white p-6">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} />
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
