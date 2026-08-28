import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { BookingCustomerDetails } from '@/types';

interface Props {
  details: BookingCustomerDetails;
  onChange: (details: BookingCustomerDetails) => void;
}

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function DetailsStep({ details, onChange }: Props) {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) {
      onChange({ ...details, referenceImageName: undefined });
      setFileError(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Please upload a JPG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File must be under ${MAX_FILE_MB}MB.`);
      return;
    }
    setFileError(null);
    onChange({ ...details, referenceImageName: file.name });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Your Details</h2>
        <p className="mt-1 text-sm text-ink-500">Tell us a bit about you so we can confirm your booking.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          value={details.fullName}
          onChange={(v) => onChange({ ...details, fullName: v })}
          required
        />
        <Field
          label="Phone Number"
          type="tel"
          value={details.phone}
          onChange={(v) => onChange({ ...details, phone: v })}
          required
        />
        <Field
          label="Email"
          type="email"
          value={details.email}
          onChange={(v) => onChange({ ...details, email: v })}
          required
        />
        <Field
          label="Address (optional)"
          value={details.address ?? ''}
          onChange={(v) => onChange({ ...details, address: v })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">
          Special Request (optional)
        </label>
        <textarea
          rows={3}
          value={details.specialRequest ?? ''}
          onChange={(e) => onChange({ ...details, specialRequest: e.target.value })}
          className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">
          Reference Hairstyle Image (optional)
        </label>
        {details.referenceImageName ? (
          <div className="flex items-center justify-between rounded-sm border border-ink/15 px-4 py-2.5 text-sm">
            <span className="truncate text-ink-700">{details.referenceImageName}</span>
            <button
              onClick={() => handleFile(undefined)}
              aria-label="Remove file"
              className="text-ink-500 hover:text-rose-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-500 hover:border-gold-500">
            <Upload size={16} />
            Click to upload (JPG, PNG, WEBP — max {MAX_FILE_MB}MB)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        )}
        {fileError && <p className="text-xs text-rose-600">{fileError}</p>}
      </div>
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
