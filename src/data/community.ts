import { CommunityPost } from '@/types';

export const communityPosts: CommunityPost[] = [
  {
    id: 'cp-1',
    type: 'announcement',
    title: 'Extended weekend hours this month',
    body: 'We are now taking extra Saturday appointments — book early to secure your preferred slot.',
    published: true,
    createdAt: '2026-08-05',
  },
  {
    id: 'cp-2',
    type: 'beauty-tip',
    title: 'Keeping knotless braids fresh',
    body: 'Wrap your braids at night and moisturize your scalp every 2–3 days to extend their lifespan.',
    published: true,
    createdAt: '2026-07-22',
  },
  {
    id: 'cp-3',
    type: 'offer',
    title: 'Refer a friend, both get a treat',
    body: 'Refer a friend for their first booking and you both receive a complimentary hair treatment.',
    published: true,
    createdAt: '2026-07-10',
  },
  {
    id: 'cp-4',
    type: 'featured-style',
    title: 'This week\'s spotlight: Frontal Lace Install',
    body: 'A melted, undetectable install that\'s been trending in the studio all week.',
    published: false,
    createdAt: '2026-08-09',
  },
];
