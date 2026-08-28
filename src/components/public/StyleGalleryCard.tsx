import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Style } from '@/types';
import { useWishlist } from '@/hooks/useWishlist';
import { useBookingDraft } from '@/hooks/useBookingDraft';

export default function StyleGalleryCard({ style, aspect = 'auto' }: { style: Style; aspect?: 'auto' | 'square' }) {
  const { toggle, isWishlisted } = useWishlist();
  const { setDraft } = useBookingDraft();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(style.id);

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    setDraft((prev) => ({ ...prev, serviceId: style.serviceId, styleId: style.id }));
    navigate('/booking');
  };

  return (
    <div className="group relative overflow-hidden rounded-sm bg-white">
      <Link to={`/styles/${style.id}`} className="block">
        <div className={aspect === 'square' ? 'aspect-square overflow-hidden' : 'overflow-hidden'}>
          <img
            src={style.images[0]}
            alt={style.name}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(style.id);
        }}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:text-rose-600"
      >
        <Heart size={15} className={wishlisted ? 'fill-rose-600 text-rose-600' : ''} />
      </button>

      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-3 pt-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/styles/${style.id}`}
            className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-cream hover:text-gold-400"
          >
            <Eye size={13} /> View
          </Link>
          <button
            onClick={handleBook}
            className="rounded-sm bg-gold-500 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink hover:bg-gold-600"
          >
            Book This Style
          </button>
        </div>
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-ink">{style.name}</p>
      </div>
    </div>
  );
}
