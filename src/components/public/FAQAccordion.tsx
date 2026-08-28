import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { FAQItem } from '@/types';

interface Props {
  items: FAQItem[];
  eyebrow?: string;
  title?: string;
}

export default function FAQAccordion({ items, eyebrow = 'Questions', title = 'Frequently Asked Questions' }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const published = items.filter((i) => i.published).sort((a, b) => a.order - b.order);

  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow={eyebrow} title={title} align="left" />

      <div className="mt-12 divide-y divide-ink/10 border-t border-ink/10">
        {published.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-base font-medium text-ink sm:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-rose-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <p className="overflow-hidden text-sm leading-relaxed text-ink-500">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
