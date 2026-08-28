const toneMap: Record<string, string> = {
  // Booking statuses
  pending: 'bg-gold-50 text-gold-700',
  confirmed: 'bg-violet-100 text-violet-600',
  'in-progress': 'bg-blue-50 text-blue-600',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-ink/10 text-ink-500',
  'no-show': 'bg-rose-50 text-rose-600',
  // Payment statuses
  successful: 'bg-green-50 text-green-700',
  failed: 'bg-rose-50 text-rose-600',
  refunded: 'bg-ink/10 text-ink-500',
  // Generic
  active: 'bg-green-50 text-green-700',
  deactivated: 'bg-ink/10 text-ink-500',
  unsubscribed: 'bg-ink/10 text-ink-500',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-rose-50 text-rose-600',
  published: 'bg-green-50 text-green-700',
  draft: 'bg-ink/10 text-ink-500',
};

export default function StatusPill({ status }: { status: string }) {
  const tone = toneMap[status] ?? 'bg-ink/10 text-ink-500';
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone}`}>
      {status.replace('-', ' ')}
    </span>
  );
}
