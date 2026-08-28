import { FormEvent, useState } from 'react';
import { MapPin, Star, Trash2, Plus } from 'lucide-react';
import { useCustomerData } from '@/hooks/useCustomerData';
import Button from '@/components/ui/Button';

export default function SavedAddresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useCustomerData();
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !fullAddress.trim() || !area.trim()) return;
    addAddress({ label, fullAddress, area, landmark: landmark || undefined, isDefault: addresses.length === 0 });
    setLabel('');
    setFullAddress('');
    setArea('');
    setLandmark('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Saved Addresses</h1>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} icon={<Plus size={14} />}>
            Add Address
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 rounded-sm border border-ink/10 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Label (e.g. Home)" value={label} onChange={setLabel} required />
            <Field label="Area" value={area} onChange={setArea} required />
          </div>
          <Field label="Full Address" value={fullAddress} onChange={setFullAddress} required />
          <Field label="Landmark (optional)" value={landmark} onChange={setLandmark} />
          <div className="flex gap-3">
            <Button type="submit" size="sm">
              Save Address
            </Button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-ink/15 py-16 text-center">
          <MapPin size={28} className="text-ink/20" />
          <p className="text-sm text-ink-500">No saved addresses yet — add one for faster home-service bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex flex-col gap-2 rounded-sm border border-ink/10 p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-medium text-ink">{addr.label}</p>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-700">
                    <Star size={10} className="fill-gold-500 text-gold-500" /> Default
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-500">{addr.fullAddress}</p>
              <p className="text-xs text-ink-500">{addr.area}</p>
              {addr.landmark && <p className="text-xs text-ink-500">Landmark: {addr.landmark}</p>}
              <div className="mt-2 flex gap-4">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-xs font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}
