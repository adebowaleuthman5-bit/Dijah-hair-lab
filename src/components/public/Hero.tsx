import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { buildDirectionsLink } from '@/utils/maps';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="container-lab grid min-h-[86vh] grid-cols-1 items-center gap-10 py-16 lg:min-h-[92vh] lg:grid-cols-12 lg:gap-6 lg:py-0">
        {/* Text block */}
        <div className="order-2 flex flex-col gap-7 lg:order-1 lg:col-span-6">
          <span className="eyebrow text-gold-500 animate-fadeup [animation-delay:0.1s] opacity-0">
            Agungi &middot; Ajah &middot; Lagos
          </span>

          <h1 className="font-display text-[13vw] font-medium leading-[0.95] sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]">
            <span className="block animate-fadeup opacity-0 [animation-delay:0.25s]">Where Desire</span>
            <span className="relative block animate-fadeup italic text-gold-400 opacity-0 [animation-delay:0.5s]">
              Meet Perfection
              <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-left animate-drawline bg-gold-500 [animation-delay:1.1s]" />
            </span>
          </h1>

          <p className="max-w-md animate-fadeup text-base text-cream/70 opacity-0 [animation-delay:0.7s] sm:text-lg">
            Luxury hair styling, weaving and beauty experiences designed around you.
          </p>

          <div className="flex animate-fadeup flex-wrap items-center gap-4 opacity-0 [animation-delay:0.9s]">
            <Button to="/booking" variant="secondary" size="lg" icon={<ArrowRight size={16} />}>
              Book a Service Now
            </Button>
            <Button to="/styles" variant="outline" size="lg" className="border-cream/30 text-cream hover:bg-cream hover:text-ink">
              Explore Our Styles
            </Button>
          </div>

          <a
            href={buildDirectionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit animate-fadeup items-center gap-2 border-b border-cream/30 pb-1 text-xs font-semibold uppercase tracking-wider text-cream/70 opacity-0 [animation-delay:1.05s] hover:border-gold-500 hover:text-gold-400"
          >
            <MapPin size={14} /> Get Directions
          </a>
        </div>

        {/* Image block */}
        <div className="order-1 col-span-1 h-[52vh] lg:order-2 lg:col-span-6 lg:h-[80vh]">
          <div className="relative h-full w-full overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80"
              alt="Model with a luxury styled hairstyle at DIJAH HAIR LAB"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-cream/10 bg-ink/40 px-5 py-4 backdrop-blur-sm">
              <span className="font-display text-sm italic text-cream/90">Signature Collection</span>
              <Link to="/styles" className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                View &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
