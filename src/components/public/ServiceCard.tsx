import { Link } from 'react-router-dom';
import { Service } from '@/types';
import { formatDuration, formatPrice } from '@/utils/format';
import Button from '@/components/ui/Button';
import { useBookingDraft } from '@/hooks/useBookingDraft';

export default function ServiceCard({ service }: { service: Service }) {
  const { setDraft } = useBookingDraft();
  const duration = formatDuration(service.durationMinutes);

  return (
    <div className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-white transition-shadow hover:shadow-soft">
      <Link to={`/services#${service.id}`} className="block aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-medium text-ink">{service.name}</h3>
        <p className="text-sm leading-relaxed text-ink-500">{service.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-500">
          {duration && <span>{duration}</span>}
          <span className="font-semibold text-rose-600">{formatPrice(service.priceFrom)}</span>
        </div>
        <Button
          to="/booking"
          size="sm"
          className="mt-1 w-full"
          onClick={() => setDraft((prev) => ({ ...prev, serviceId: service.id }))}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
