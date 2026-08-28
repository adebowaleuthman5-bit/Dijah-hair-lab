export interface StyleCategoryInfo {
  id: string;
  label: string;
  description: string;
  image: string;
  filter: { category?: string; gender?: string; isNewArrival?: boolean; isPopular?: boolean };
}

// Powers the "Style Collections" section on the home page and the
// /admin/categories screen later.
export const styleCollections: StyleCategoryInfo[] = [
  {
    id: 'col-womens',
    label: "Women's Styles",
    description: 'Braids, weaves, updos and silk presses — styled for every occasion.',
    image:
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    filter: { gender: 'women' },
  },
  {
    id: 'col-mens',
    label: "Men's Styles",
    description: 'Precision cuts and grooming for the modern gentleman.',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    filter: { gender: 'men' },
  },
  {
    id: 'col-dreadlocks',
    label: 'Dreadlocks',
    description: 'Loc starts, retwists and maintenance built for the long run.',
    image:
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1000&q=80',
    filter: { category: 'dreadlocking' },
  },
  {
    id: 'col-new',
    label: 'New Arrivals',
    description: 'Fresh looks just added to the DIJAH HAIR LAB collection.',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    filter: { isNewArrival: true },
  },
  {
    id: 'col-popular',
    label: 'Popular Styles',
    description: 'The looks our clients keep coming back for.',
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80',
    filter: { isPopular: true },
  },
];
