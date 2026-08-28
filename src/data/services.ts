import { Service } from '@/types';

// Demo/seed data. Structured to be dropped into a Supabase `services`
// table as-is later — id stability matters because styles.ts references
// these ids via serviceId.
export const services: Service[] = [
  {
    id: 'svc-hair-weaving',
    name: 'Luxury Hair Weaving',
    category: 'hair-weaving',
    description:
      'Premium weaving techniques for a seamless, natural finish — from classic sew-ins to full luxury installs.',
    image:
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: 180,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: true,
    active: true,
  },
  {
    id: 'svc-womens-styling',
    name: "Women's Hairstyles",
    category: 'womens-styling',
    description:
      'Editorial-grade styling for every occasion — braids, updos, silk presses and signature looks.',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: 120,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: true,
    active: true,
  },
  {
    id: 'svc-mens-styling',
    name: "Men's Hairstyles",
    category: 'mens-styling',
    description:
      'Sharp cuts, line-ups and grooming, tailored with precision for the modern gentleman.',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: 60,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: true,
    active: true,
  },
  {
    id: 'svc-dreadlocking',
    name: 'Dreadlocking',
    category: 'dreadlocking',
    description:
      'Expert loc starts, retwists and styling — built for healthy, long-term growth.',
    image:
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: 150,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: true,
    active: true,
  },
  {
    id: 'svc-home-service',
    name: 'Home Service',
    category: 'home-service',
    description:
      'The full DIJAH HAIR LAB experience, brought to your doorstep anywhere in Lagos.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: undefined,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: true,
    active: true,
  },
  {
    id: 'svc-custom-styling',
    name: 'Custom Styling',
    category: 'custom-styling',
    description:
      'Bring a reference or a vision — we build a bespoke style around exactly what you want.',
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80',
    durationMinutes: undefined,
    priceFrom: undefined,
    homeServiceAvailable: true,
    featured: false,
    active: true,
  },
];

export const getServiceById = (id: string) => services.find((s) => s.id === id);
export const getActiveServices = () => services.filter((s) => s.active);
export const getFeaturedServices = () => services.filter((s) => s.featured && s.active);

// Replaces the array's contents in place (not a reassignment) so every
// module that did `import { services } from '@/data/services'` keeps
// seeing the same array reference — the mutation is visible to them the
// next time anything re-renders. Called once from App.tsx on startup when
// Supabase is configured. See src/data/business.ts for the same pattern
// with more detail on why this works without a context.
export function replaceServices(live: Service[]) {
  services.length = 0;
  services.push(...live);
}
