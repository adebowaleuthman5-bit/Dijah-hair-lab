import { useMemo, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import StatusPill from '@/components/admin/StatusPill';
import StatCard from '@/components/admin/StatCard';
import { useAdminOps } from '@/hooks/useAdminOps';
import { formatReadableDate } from '@/utils/format';
import { PaymentStatus } from '@/types';
import { Wallet, CheckCircle2, Clock3, XCircle } from 'lucide-react';

const nairaFormatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
const filters: (PaymentStatus | 'all')[] = ['all', 'pending', 'successful', 'failed', 'refunded'];

export default function AdminPayments() {
  const { payments, updatePaymentStatus } = useAdminOps();
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');

  const filtered = useMemo(() => payments.filter((p) => filter === 'all' || p.status === filter), [payments, filter]);

  const totalSuccessful = payments.filter((p) => p.status === 'successful').reduce((s, p) => s + (p.amount ?? 0), 0);
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const failedCount = payments.filter((p) => p.status === 'failed').length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Payments</h1>
        <p className="mt-1 text-sm text-ink-500">
          Frontend-only demo, structured for a future Paystack integration.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Collected" value={nairaFormatter.format(totalSuccessful)} icon={Wallet} tone="gold" />
        <StatCard label="Successful" value={payments.filter((p) => p.status === 'successful').length} icon={CheckCircle2} tone="default" />
        <StatCard label="Pending" value={pendingCount} icon={Clock3} tone="gold" />
        <StatCard label="Failed" value={failedCount} icon={XCircle} tone="rose" />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filter === f ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <AdminTable columns={['Payment ID', 'Customer', 'Booking', 'Amount', 'Method', 'Date', 'Status', '']} isEmpty={filtered.length === 0}>
        {filtered.map((p) => (
          <tr key={p.id} className="hover:bg-cream-100/50">
            <td className="px-4 py-3 font-medium text-ink">{p.id}</td>
            <td className="px-4 py-3 text-ink-700">{p.customerName}</td>
            <td className="px-4 py-3 text-ink-700">{p.bookingReference}</td>
            <td className="px-4 py-3 text-ink-700">{p.amount ? nairaFormatter.format(p.amount) : '—'}</td>
            <td className="px-4 py-3 text-ink-700">{p.method ?? '—'}</td>
            <td className="px-4 py-3 text-ink-700">{formatReadableDate(p.date)}</td>
            <td className="px-4 py-3">
              <StatusPill status={p.status} />
            </td>
            <td className="px-4 py-3 text-right">
              {p.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <button onClick={() => updatePaymentStatus(p.id, 'successful')} className="text-xs font-semibold uppercase text-green-700">
                    Mark Paid
                  </button>
                  <button onClick={() => updatePaymentStatus(p.id, 'failed')} className="text-xs font-semibold uppercase text-rose-600">
                    Mark Failed
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
