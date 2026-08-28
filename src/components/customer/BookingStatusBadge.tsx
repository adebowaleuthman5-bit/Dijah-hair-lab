import { BookingStatus } from '@/types';

const statusStyles: Record<BookingStatus, string> = {
  pending: 'bg-gold-50 text-gold-700',
  confirmed: 'bg-violet-100 text-violet-600',
  'in-progress': 'bg-rose-100 text-rose-600',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-ink/5 text-ink-500',
  'no-show': 'bg-red-50 text-red-600',
};

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No-show',
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
