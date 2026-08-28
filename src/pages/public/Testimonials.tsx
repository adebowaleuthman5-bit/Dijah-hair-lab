import PageBanner from '@/components/public/PageBanner';
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel';
import RatingStars from '@/components/ui/RatingStars';
import { testimonials } from '@/data/testimonials';
import { formatReadableDate } from '@/utils/format';

export default function Testimonials() {
  const approved = testimonials.filter((t) => t.approved);

  return (
    <>
      <PageBanner
        eyebrow="Client Love"
        title="Testimonials"
        description="Real stories, and clearly-marked demo content where reviews are still being collected."
      />

      <TestimonialsCarousel testimonials={approved} />

      <section className="container-lab pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 rounded-sm border border-ink/10 p-6">
              {t.isDemo && (
                <span className="w-fit rounded-full bg-gold-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
                  Demo content
                </span>
              )}
              <RatingStars rating={t.rating} />
              <p className="text-sm leading-relaxed text-ink-500">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-auto pt-2">
                <p className="text-sm font-semibold text-ink">{t.customerName}</p>
                <p className="text-xs text-ink-500">
                  {[t.service, t.location].filter(Boolean).join(' · ')} · {formatReadableDate(t.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
