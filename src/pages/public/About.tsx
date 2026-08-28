import PageBanner from '@/components/public/PageBanner';
import Button from '@/components/ui/Button';
import { Gem, ShieldCheck, Home as HomeIcon, Sparkles } from 'lucide-react';

const values = [
  { icon: Gem, title: 'Craft', text: 'Every style is treated as a piece of craft, not a routine service.' },
  { icon: ShieldCheck, title: 'Trust', text: 'Clean tools, honest consultations, and results that speak for themselves.' },
  { icon: HomeIcon, title: 'Convenience', text: 'In-shop or at home — the same premium experience, wherever you are.' },
  { icon: Sparkles, title: 'Community', text: 'We grow with our clients, sharing tips, offers and new looks along the way.' },
];

export default function About() {
  return (
    <>
      <PageBanner
        eyebrow="Our Story"
        title="About DIJAH HAIR LAB"
        description="A premium hair styling and weaving studio built on desire, precision and perfection."
      />

      <section className="container-lab grid grid-cols-1 gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="aspect-[4/5] overflow-hidden rounded-sm">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
            alt="DIJAH HAIR LAB studio"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-5">
          <span className="eyebrow">Where Desire Meet Perfection</span>
          <p className="text-base leading-relaxed text-ink-500">
            DIJAH HAIR LAB began with a simple idea — that luxury hair styling shouldn&apos;t be
            reserved for special occasions alone. Based in Agungi, Ajah, we&apos;ve built a studio
            where women and men come for editorial-level weaving, styling and dreadlocking, and
            leave feeling like the best version of themselves.
          </p>
          <p className="text-base leading-relaxed text-ink-500">
            Whether you visit us in-shop or invite us into your home, our promise stays the same:
            precision, warmth and a finish worth showing off.
          </p>
          <div className="pt-2">
            <Button to="/booking">Book a Service Now</Button>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="container-lab grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <Icon size={20} />
              </span>
              <h3 className="font-display text-base font-medium text-ink">{title}</h3>
              <p className="text-sm text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
