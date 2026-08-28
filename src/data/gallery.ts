import { GalleryImage } from '@/types';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

export const galleryImages: GalleryImage[] = [
  { id: 'gal-1', url: img('photo-1519699047748-de8e457a634e'), caption: 'Luxury sew-in finish', category: 'hair-weaving', featured: true, visibleOnHome: true, order: 1 },
  { id: 'gal-2', url: img('photo-1560066984-138dadb4c035'), caption: 'Knotless braids, side profile', category: 'womens-styling', featured: true, visibleOnHome: true, order: 2 },
  { id: 'gal-3', url: img('photo-1503951914875-452162b0f3f1'), caption: 'Sharp skin fade', category: 'mens-styling', featured: false, visibleOnHome: true, order: 3 },
  { id: 'gal-4', url: img('photo-1621607512214-68297480165e'), caption: 'Fresh loc retwist', category: 'dreadlocking', featured: true, visibleOnHome: true, order: 4 },
  { id: 'gal-5', url: img('photo-1522337360788-8b13dee7a37e'), caption: 'Home service session', category: 'home-service', featured: false, visibleOnHome: false, order: 5 },
  { id: 'gal-6', url: img('photo-1595476108010-b4d1f102b1b1'), caption: 'Custom vision style', category: 'custom-styling', featured: false, visibleOnHome: true, order: 6 },
  { id: 'gal-7', url: img('photo-1517841905240-472988babdf9'), caption: 'Editorial studio shot', featured: true, visibleOnHome: true, order: 7 },
  { id: 'gal-8', url: img('photo-1522336284037-91f7da073525'), caption: 'Silk press shine', category: 'womens-styling', featured: false, visibleOnHome: false, order: 8 },
];
