import { Link } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import { styleCollections } from '@/data/categories';

export default function StyleCollections() {
  return (
    <section className="bg-ink-700 py-20 text-cream lg:py-28">
      <div className="container-lab">
        <SectionHeading eyebrow="Collections" title="Style Collections" align="left" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {styleCollections.map((col, idx) => (
            <Link
              key={col.id}
              to="/styles"
              className={`group relative overflow-hidden rounded-sm ${
                idx === 0 ? 'sm:col-span-2 sm:row-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className={`relative ${idx === 0 ? 'aspect-square sm:aspect-[4/5]' : 'aspect-[4/5]'}`}>
                <img
                  src={col.image}
                  alt={col.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl italic text-cream">{col.label}</h3>
                  <p className="mt-1 hidden text-xs text-cream/70 sm:block">{col.description}</p>
                  <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-widest2 text-gold-400">
                    Explore Styles &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
