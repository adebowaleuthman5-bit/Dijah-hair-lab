import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import RatingStars from '@/components/ui/RatingStars';
import Button from '@/components/ui/Button';
import { getFeaturedStyles } from '@/data/styles';
import { formatPrice } from '@/utils/format';
import { useWishlist } from '@/hooks/useWishlist';
import { useBookingDraft } from '@/hooks/useBookingDraft';

export default function FeaturedStyles() {
  const featured = getFeaturedStyles();
  const { toggle, isWishlisted } = useWishlist();
  const { setDraft } = useBookingDraft();
  const navigate = useNavigate();

  return (
    <section className="bg-rose-50 py-20 lg:py-28">
      <div className="container-lab">
        <SectionHeading eyebrow="Best Loved" title="Featured Styles" align="left" />

        <div className="mt-12 flex gap-5 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {featured.map((style) => (
            <div
              key={style.id}
              className="min-w-[75%] shrink-0 overflow-hidden rounded-sm bg-white shadow-soft sm:min-w-0 sm:shrink"
            >
              <Link to={`/styles/${style.id}`} className="block aspect-[4/5] overflow-hidden">
                <img src={style.images[0]} alt={style.name} loading="lazy" className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      {style.category.replace('-', ' ')}
                    </p>
                    <h3 className="font-display text-base font-medium text-ink">{style.name}</h3>
                  </div>
                  <button
                    onClick={() => toggle(style.id)}
                    aria-label="Toggle wishlist"
                    className="shrink-0 text-ink-500 hover:text-rose-600"
                  >
                    <Heart size={16} className={isWishlisted(style.id) ? 'fill-rose-600 text-rose-600' : ''} />
                  </button>
                </div>
                <RatingStars rating={style.rating} />
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink-700">{formatPrice(style.priceFrom)}</span>
                  <button
                    onClick={() => {
                      setDraft((prev) => ({ ...prev, serviceId: style.serviceId, styleId: style.id }));
                      navigate('/booking');
                    }}
                    className="rounded-sm bg-ink px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-cream hover:bg-ink-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button to="/styles" variant="outline">
            See All Styles
          </Button>
        </div>
      </div>
    </section>
  );
}
