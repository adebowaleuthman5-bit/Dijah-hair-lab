import { useState } from 'react';
import { CheckCircle2, EyeOff, Star, ShieldCheck } from 'lucide-react';
import RatingStars from '@/components/ui/RatingStars';
import { useAdminContent } from '@/hooks/useAdminContent';
import { formatReadableDate } from '@/utils/format';
import { Review } from '@/types';

const filters: { label: string; value: Review['status'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AdminReviews() {
  const { reviews, updateReview } = useAdminContent();
  const [filter, setFilter] = useState<Review['status'] | 'all'>('all');

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-ink-500">Moderate customer reviews submitted after completed bookings.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filter === f.value ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-sm border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {r.customerName}
                  {r.verified && <ShieldCheck size={13} className="text-violet-500" />}
                </p>
                <p className="text-xs text-ink-500">{[r.service, formatReadableDate(r.date)].filter(Boolean).join(' · ')}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  r.status === 'approved' ? 'bg-green-50 text-green-700' : r.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-gold-50 text-gold-700'
                }`}
              >
                {r.status}
              </span>
            </div>
            <RatingStars rating={r.rating} />
            <p className="text-sm leading-relaxed text-ink-500">{r.review}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => updateReview(r.id, { status: 'approved', visible: true })}
                className="flex items-center gap-1 rounded-sm bg-green-50 px-3 py-1.5 text-[11px] font-semibold uppercase text-green-700"
              >
                <CheckCircle2 size={13} /> Approve
              </button>
              <button
                onClick={() => updateReview(r.id, { status: 'rejected', visible: false })}
                className="flex items-center gap-1 rounded-sm bg-rose-50 px-3 py-1.5 text-[11px] font-semibold uppercase text-rose-600"
              >
                <EyeOff size={13} /> Reject
              </button>
              <button
                onClick={() => updateReview(r.id, { visible: !r.visible })}
                className="flex items-center gap-1 rounded-sm bg-gold-50 px-3 py-1.5 text-[11px] font-semibold uppercase text-gold-700"
              >
                <Star size={13} /> {r.visible ? 'Featured' : 'Feature'}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-12 text-center text-sm text-ink-500">No reviews in this filter.</p>}
      </div>
    </div>
  );
}
