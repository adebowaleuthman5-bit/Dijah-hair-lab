import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ZoomIn, X } from 'lucide-react';
import RatingStars from '@/components/ui/RatingStars';
import Button from '@/components/ui/Button';
import { getStyleById } from '@/data/styles';
import { getServiceById } from '@/data/services';
import { formatDuration, formatPrice } from '@/utils/format';
import { useWishlist } from '@/hooks/useWishlist';
import { useBookingDraft } from '@/hooks/useBookingDraft';
import { buildWhatsAppLink } from '@/utils/whatsapp';

export default function StyleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const style = id ? getStyleById(id) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { toggle, isWishlisted } = useWishlist();
  const { setDraft } = useBookingDraft();

  if (!style) {
    return (
      <div className="container-lab flex flex-col items-center gap-4 py-32 text-center">
        <h1 className="font-display text-2xl text-ink">Style not found</h1>
        <p className="text-sm text-ink-500">This style may have been removed or renamed.</p>
        <Button to="/styles" variant="outline">
          Back to Styles
        </Button>
      </div>
    );
  }

  const service = getServiceById(style.serviceId);
  const wishlisted = isWishlisted(style.id);
  const duration = formatDuration(style.durationMinutes);

  const handleBookStyle = () => {
    setDraft((prev) => ({ ...prev, serviceId: style.serviceId, styleId: style.id }));
    navigate('/booking');
  };

  return (
    <section className="container-lab py-10 lg:py-16">
      <nav className="mb-6 text-xs text-ink-500">
        <Link to="/styles" className="hover:text-rose-600">
          Styles
        </Link>{' '}
        / <span className="text-ink">{style.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-cream-100">
            <img
              src={style.images[activeImage]}
              alt={style.name}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => setZoomOpen(true)}
              aria-label="Zoom image"
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ZoomIn size={16} />
            </button>
          </div>
          {style.images.length > 1 && (
            <div className="flex gap-2">
              {style.images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 ${
                    idx === activeImage ? 'border-gold-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                {service?.name ?? style.category.replace('-', ' ')}
              </p>
              <h1 className="mt-1 font-display text-3xl font-medium text-ink sm:text-4xl">{style.name}</h1>
            </div>
            <button
              onClick={() => toggle(style.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-rose-600 hover:text-rose-600"
            >
              <Heart size={18} className={wishlisted ? 'fill-rose-600 text-rose-600' : ''} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={style.rating} />
            <span className="text-xs text-ink-500">
              {style.reviewCount > 0 ? `${style.reviewCount} reviews` : 'New style'}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-ink-500">{style.description}</p>

          <div className="grid grid-cols-2 gap-4 rounded-sm border border-ink/10 p-5 text-sm">
            <DetailRow label="Category" value={style.category.replace('-', ' ')} />
            <DetailRow label="Gender" value={style.gender} />
            {duration && <DetailRow label="Duration" value={duration} />}
            <DetailRow label="Price" value={formatPrice(style.priceFrom)} />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={handleBookStyle} size="lg">
              Book This Style
            </Button>
            <Button
              href={buildWhatsAppLink(`Hi, I'm interested in the "${style.name}" style.`)}
              target="_blank"
              variant="whatsapp"
              size="lg"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            aria-label="Close zoom"
            className="absolute right-5 top-5 text-cream hover:text-gold-400"
            onClick={() => setZoomOpen(false)}
          >
            <X size={28} />
          </button>
          <img
            src={style.images[activeImage]}
            alt={style.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-0.5 capitalize text-ink">{value}</p>
    </div>
  );
}
