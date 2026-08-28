import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import RatingStars from '@/components/ui/RatingStars';
import { Testimonial } from '@/types';
import { formatReadableDate } from '@/utils/format';

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  if (!current) return null;

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow="Client Love" title="Testimonials" align="center" />

      <div className="relative mx-auto mt-14 max-w-2xl text-center">
        {current.isDemo && (
          <span className="mb-4 inline-block rounded-full bg-gold-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
            Demo content
          </span>
        )}
        <Quote className="mx-auto mb-4 text-gold-500" size={28} />
        <p className="font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
          &ldquo;{current.review}&rdquo;
        </p>

        <div className="mt-6 flex flex-col items-center gap-1">
          <RatingStars rating={current.rating} />
          <p className="mt-2 text-sm font-semibold text-ink">{current.customerName}</p>
          <p className="text-xs text-ink-500">
            {[current.service, current.location].filter(Boolean).join(' · ')}
          </p>
          <p className="text-xs text-ink-500/70">{formatReadableDate(current.date)}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-rose-600 hover:text-rose-600"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-rose-600' : 'bg-ink/20'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-rose-600 hover:text-rose-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
