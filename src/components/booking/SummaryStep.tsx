import { BookingDraft } from '@/types';
import { getServiceById } from '@/data/services';
import { getStyleById } from '@/data/styles';
import { getFullAddress } from '@/data/business';
import { formatPrice, formatReadableDate } from '@/utils/format';

export default function SummaryStep({ draft }: { draft: BookingDraft }) {
  const service = draft.serviceId ? getServiceById(draft.serviceId) : undefined;
  const style = draft.styleId ? getStyleById(draft.styleId) : undefined;
  const estimatedCost = style?.priceFrom ?? service?.priceFrom;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Booking Summary</h2>
        <p className="mt-1 text-sm text-ink-500">Please review your details before confirming.</p>
      </div>

      <div className="flex flex-col divide-y divide-ink/10 rounded-sm border border-ink/10">
        <Row label="Service" value={service?.name ?? '—'} />
        {style && <Row label="Style" value={style.name} />}
        <Row
          label="Location"
          value={
            draft.locationType === 'in-shop'
              ? `In-Shop — ${getFullAddress()}`
              : draft.locationType === 'home-service' && draft.homeServiceDetails
                ? `Home Service — ${draft.homeServiceDetails.fullAddress}, ${draft.homeServiceDetails.area}`
                : '—'
          }
        />
        <Row label="Date" value={draft.date ? formatReadableDate(draft.date) : '—'} />
        <Row label="Time" value={draft.time ?? '—'} />
        <Row label="Customer" value={draft.customer?.fullName ?? '—'} />
        <Row label="Phone" value={draft.customer?.phone ?? '—'} />
        <Row label="Estimated Cost" value={formatPrice(estimatedCost)} emphasize />
      </div>
    </div>
  );
}

function Row({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <span className={`text-sm ${emphasize ? 'font-semibold text-rose-600' : 'text-ink'}`}>{value}</span>
    </div>
  );
}
