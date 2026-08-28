import { CustomerNotification } from '@/types';

export const demoNotifications: CustomerNotification[] = [
  {
    id: 'ntf-1',
    type: 'booking',
    title: 'Appointment confirmed',
    message: 'Your Knotless Box Braids appointment has been confirmed for your selected date.',
    date: '2026-08-05',
    read: false,
  },
  {
    id: 'ntf-2',
    type: 'promo',
    title: 'New style added',
    message: 'A new Bridal Editorial Updo style just landed in our gallery — take a look.',
    date: '2026-08-01',
    read: false,
  },
  {
    id: 'ntf-3',
    type: 'system',
    title: 'Welcome to DIJAH HAIR LAB',
    message: 'Your account was created successfully. Explore styles and book your first visit.',
    date: '2026-07-20',
    read: true,
  },
];
