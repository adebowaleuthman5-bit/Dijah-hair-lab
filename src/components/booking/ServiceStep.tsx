import { BookingDraft } from '@/types';
import { getActiveServices } from '@/data/services';
import { formatDuration, formatPrice } from '@/utils/format';

interface Props {
  draft: BookingDraft;
  onSelect: (serviceId: string) => void;
}

export default function ServiceStep({ draft, onSelect }: Props) {
  const allServices = getActiveServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Select a Service</h2>
        <p className="mt-1 text-sm text-ink-500">Choose the service you&apos;d like to book.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allServices.map((service) => {
          const selected = draft.serviceId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`flex items-center gap-4 rounded-sm border p-4 text-left transition-colors ${
                selected ? 'border-rose-600 bg-rose-50' : 'border-ink/10 hover:border-ink/30'
              }`}
            >
              <img src={service.image} alt="" className="h-16 w-16 shrink-0 rounded-sm object-cover" />
              <div className="min-w-0">
                <p className="font-display text-base font-medium text-ink">{service.name}</p>
                <p className="mt-0.5 truncate text-xs text-ink-500">{service.description}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-500">
                  {formatDuration(service.durationMinutes) && <span>{formatDuration(service.durationMinutes)}</span>}
                  <span className="font-semibold text-rose-600">{formatPrice(service.priceFrom)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
