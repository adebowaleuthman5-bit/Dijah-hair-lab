import { Testimonial } from '@/types';

// Clearly marked as demo content per the brief — no fabricated real
// customer names presented as genuine reviews. Replace via
// /admin/testimonials once real reviews are collected.
export const testimonials: Testimonial[] = [
  {
    id: 'tst-1',
    customerName: 'Demo Client A',
    location: 'Lekki, Lagos',
    rating: 5,
    review:
      'Sample review — the kind of detail-oriented styling and finish DIJAH HAIR LAB aims to deliver on every appointment.',
    service: "Women's Hairstyles",
    date: '2026-06-02',
    isDemo: true,
    approved: true,
    featured: true,
  },
  {
    id: 'tst-2',
    customerName: 'Demo Client B',
    location: 'Ajah, Lagos',
    rating: 5,
    review:
      'Sample review — illustrating the kind of home-service experience DIJAH HAIR LAB is built to provide.',
    service: 'Home Service',
    date: '2026-05-18',
    isDemo: true,
    approved: true,
    featured: true,
  },
  {
    id: 'tst-3',
    customerName: 'Demo Client C',
    location: 'Victoria Island, Lagos',
    rating: 4.5,
    review:
      'Sample review — a placeholder showing the tone and structure real testimonials will follow.',
    service: 'Dreadlocking',
    date: '2026-04-27',
    isDemo: true,
    approved: true,
    featured: true,
  },
];

// See src/data/services.ts's replaceServices() for why an in-place
// mutation (not reassignment) is what makes this visible to every importer.
export function replaceTestimonials(live: Testimonial[]) {
  testimonials.length = 0;
  testimonials.push(...live);
}
