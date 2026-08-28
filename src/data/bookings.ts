import { Booking } from '@/types';

// Seed booking history so the account dashboard has something to show on
// first load. New bookings made through the live booking flow are appended
// to this at runtime via useCustomer — this file only supplies the starting
// demo state.
export const demoBookingHistory: Booking[] = [
  {
    id: 'bk-demo-1',
    reference: 'DHL-7421AB',
    serviceId: 'svc-womens-styling',
    styleId: 'sty-knotless-braids',
    locationType: 'in-shop',
    date: '2026-08-20',
    time: '11:00 AM',
    customer: { fullName: 'Amara Okafor', phone: '08012345678', email: 'amara@example.com' },
    status: 'confirmed',
    createdAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'bk-demo-2',
    reference: 'DHL-6210CT',
    serviceId: 'svc-hair-weaving',
    styleId: 'sty-frontal-install',
    locationType: 'home-service',
    homeServiceDetails: { fullAddress: '12 Freedom Way', area: 'Lekki Phase 1, Lagos' },
    date: '2026-06-10',
    time: '10:00 AM',
    customer: { fullName: 'Amara Okafor', phone: '08012345678', email: 'amara@example.com' },
    status: 'completed',
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'bk-demo-3',
    reference: 'DHL-5187ZK',
    serviceId: 'svc-womens-styling',
    styleId: 'sty-silk-press',
    locationType: 'in-shop',
    date: '2026-05-02',
    time: '1:00 PM',
    customer: { fullName: 'Amara Okafor', phone: '08012345678', email: 'amara@example.com' },
    status: 'cancelled',
    createdAt: '2026-04-20T14:00:00.000Z',
  },
];
