import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BookingDraft } from '@/types';
import { getStylesByService } from '@/data/styles';
import { formatDuration, formatPrice } from '@/utils/format';
import RatingStars from '@/components/ui/RatingStars';

interface Props {
  draft: BookingDraft;
  onSelect: (styleId: string) => void;
}

export default function StyleStep({ draft, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const allStyles = draft.serviceId ? getStylesByService(draft.serviceId) : [];

  const filtered = useMemo(
    () => allStyles.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [allStyles, query]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Select a Style</h2>
        <p className="mt-1 text-sm text-ink-500">Pick the look you want for this appointment.</p>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type="text"
          placeholder="Search styles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-sm border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-gold-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-500">
          No styles found for this service yet — you can still continue and describe your preference
          in the details step.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtered.map((style) => {
            const selected = draft.styleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onSelect(style.id)}
                className={`overflow-hidden rounded-sm border text-left transition-colors ${
                  selected ? 'border-rose-600' : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={style.images[0]} alt={style.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-ink">{style.name}</p>
                  <RatingStars rating={style.rating} size={11} />
                  <div className="mt-1 flex items-center justify-between text-[10px] text-ink-500">
                    {formatDuration(style.durationMinutes) && <span>{formatDuration(style.durationMinutes)}</span>}
                    <span className="font-semibold text-rose-600">{formatPrice(style.priceFrom)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
