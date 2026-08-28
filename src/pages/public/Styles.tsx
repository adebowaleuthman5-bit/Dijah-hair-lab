import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageBanner from '@/components/public/PageBanner';
import StyleGalleryCard from '@/components/public/StyleGalleryCard';
import { styles } from '@/data/styles';
import { services } from '@/data/services';
import { StyleGender } from '@/types';

const genderFilters: { label: string; value: StyleGender | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Unisex', value: 'unisex' },
];

export default function Styles() {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState<StyleGender | 'all'>('all');
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    return styles.filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchesGender = gender === 'all' || s.gender === gender;
      const matchesCategory = category === 'all' || s.category === category;
      return matchesQuery && matchesGender && matchesCategory && s.bookable;
    });
  }, [query, gender, category]);

  return (
    <>
      <PageBanner
        eyebrow="The Gallery"
        title="Explore Our Styles"
        description="Browse the full DIJAH HAIR LAB catalogue and book the look you love."
      />

      <section className="container-lab py-16 lg:py-20">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search styles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-sm border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-gold-500"
              aria-label="Search styles"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {genderFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setGender(f.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  gender === f.value
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink-700 hover:border-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              category === 'all' ? 'border-rose-600 text-rose-600' : 'border-ink/15 text-ink-500 hover:border-rose-600'
            }`}
          >
            All Categories
          </button>
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setCategory(s.category)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                category === s.category
                  ? 'border-rose-600 text-rose-600'
                  : 'border-ink/15 text-ink-500 hover:border-rose-600'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-sm text-ink-500">
            No styles match your search — try a different term or filter.
          </div>
        ) : (
          <div className="masonry mt-10">
            {filtered.map((style) => (
              <StyleGalleryCard key={style.id} style={style} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
