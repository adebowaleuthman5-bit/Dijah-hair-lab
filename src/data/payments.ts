import { PaymentRecord } from '@/types';

// Demo payment records, loosely tied to bookings by reference. Frontend UI
// only per the brief — structured for a future Paystack integration where
// each booking gets a real payment intent/record.
export const paymentRecords: PaymentRecord[] = [
  { id: 'pay-1', bookingId: 'bk-demo-2', bookingReference: 'DHL-6210CT', customerName: 'Amara Okafor', amount: 85000, method: 'Bank Transfer', status: 'successful', date: '2026-06-01' },
  { id: 'pay-2', bookingId: 'bk-demo-3', bookingReference: 'DHL-5187ZK', customerName: 'Amara Okafor', amount: 25000, method: 'Card', status: 'refunded', date: '2026-04-20' },
  { id: 'pay-3', bookingId: 'bk-adm-5', bookingReference: 'DHL-4471HB', customerName: 'Tunde Bakare', amount: 15000, method: 'Cash', status: 'successful', date: '2026-07-20' },
  { id: 'pay-4', bookingId: 'bk-adm-6', bookingReference: 'DHL-2298VC', customerName: 'Ifeoma Chukwu', amount: 45000, method: 'Card', status: 'successful', date: '2026-07-01' },
  { id: 'pay-5', bookingId: 'bk-adm-2', bookingReference: 'DHL-8842QW', customerName: 'Ngozi Eze', method: 'Bank Transfer', status: 'pending', date: '2026-08-09' },
  { id: 'pay-6', bookingId: 'bk-adm-3', bookingReference: 'DHL-1027LM', customerName: 'Zainab Yusuf', method: 'Card', status: 'pending', date: '2026-08-08' },
  { id: 'pay-7', bookingId: 'bk-adm-7', bookingReference: 'DHL-9930AK', customerName: 'Ngozi Eze', amount: 25000, method: 'Card', status: 'failed', date: '2026-06-28' },
];
