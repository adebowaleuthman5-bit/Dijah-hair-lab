import { Store, Home } from 'lucide-react';
import { BookingDraft, BookingLocationType, HomeServiceDetails } from '@/types';
import { getFullAddress } from '@/data/business';
import { buildDirectionsLink } from '@/utils/maps';

interface Props {
  draft: BookingDraft;
  onSelectType: (type: BookingLocationType) => void;
  onChangeHomeDetails: (details: HomeServiceDetails) => void;
}

export default function LocationStep({ draft, onSelectType, onChangeHomeDetails }: Props) {
  const details = draft.homeServiceDetails ?? { fullAddress: '', area: '', landmark: '', instructions: '' };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Where would you like your service?</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelectType('in-shop')}
          className={`flex flex-col gap-3 rounded-sm border p-6 text-left transition-colors ${
            draft.locationType === 'in-shop' ? 'border-rose-600 bg-rose-50' : 'border-ink/10 hover:border-ink/30'
          }`}
        >
          <Store size={22} className="text-rose-600" />
          <div>
            <p className="font-display text-lg font-medium text-ink">In-Shop</p>
            <p className="mt-1 text-sm text-ink-500">DIJAH HAIR LAB, {getFullAddress()}</p>
          </div>
          <a
            href={buildDirectionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-fit text-xs font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
          >
            Get Directions
          </a>
        </button>

        <button
          onClick={() => onSelectType('home-service')}
          className={`flex flex-col gap-3 rounded-sm border p-6 text-left transition-colors ${
            draft.locationType === 'home-service' ? 'border-rose-600 bg-rose-50' : 'border-ink/10 hover:border-ink/30'
          }`}
        >
          <Home size={22} className="text-rose-600" />
          <div>
            <p className="font-display text-lg font-medium text-ink">Home Service</p>
            <p className="mt-1 text-sm text-ink-500">We come to you, anywhere in Lagos.</p>
          </div>
        </button>
      </div>

      {draft.locationType === 'home-service' && (
        <div className="flex flex-col gap-4 rounded-sm border border-ink/10 p-5">
          <Field
            label="Full Address"
            value={details.fullAddress}
            onChange={(v) => onChangeHomeDetails({ ...details, fullAddress: v })}
            required
          />
          <Field label="Area" value={details.area} onChange={(v) => onChangeHomeDetails({ ...details, area: v })} required />
          <Field
            label="Landmark (optional)"
            value={details.landmark ?? ''}
            onChange={(v) => onChangeHomeDetails({ ...details, landmark: v })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">
              Additional Instructions (optional)
            </label>
            <textarea
              rows={3}
              value={details.instructions ?? ''}
              onChange={(e) => onChangeHomeDetails({ ...details, instructions: e.target.value })}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
          </div>
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
