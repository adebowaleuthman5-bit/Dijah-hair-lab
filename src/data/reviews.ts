import { Review } from '@/types';

// Reviews are customer-submitted, tied to bookings, and moderated by admin —
// distinct from Testimonials, which are curated marketing copy. Clearly
// demo content until real reviews come in from completed bookings.
export const reviews: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Amara Okafor',
    rating: 5,
    review: 'Sample review — reflects the kind of detail and finish expected on a completed weaving appointment.',
    service: 'Luxury Hair Weaving',
    date: '2026-06-11',
    verified: true,
    status: 'approved',
    visible: true,
  },
  {
    id: 'rev-2',
    customerName: 'Tunde Bakare',
    rating: 4,
    review: 'Sample review — illustrating feedback tone for a men\'s styling appointment.',
    service: "Men's Hairstyles",
    date: '2026-07-29',
    verified: true,
    status: 'approved',
    visible: true,
  },
  {
    id: 'rev-3',
    customerName: 'Ifeoma Chukwu',
    rating: 5,
    review: 'Sample review — demonstrating the review queue for a recently completed dreadlocking service.',
    service: 'Dreadlocking',
    date: '2026-07-16',
    verified: true,
    status: 'pending',
    visible: false,
  },
  {
    id: 'rev-4',
    customerName: 'Ngozi Eze',
    rating: 2,
    review: 'Sample review — a lower-rated example so the moderation queue shows a realistic mix.',
    service: 'Silk Press & Trim',
    date: '2026-07-11',
    verified: true,
    status: 'pending',
    visible: false,
  },
];
