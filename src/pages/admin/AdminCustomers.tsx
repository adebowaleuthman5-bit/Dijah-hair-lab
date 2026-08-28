import { useMemo, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import { useAdminOps } from '@/hooks/useAdminOps';
import { formatReadableDate } from '@/utils/format';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { CustomerDirectoryEntry } from '@/types';

export default function AdminCustomers() {
  const { customers, bookings, deactivateCustomer, reactivateCustomer } = useAdminOps();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CustomerDirectoryEntry | null>(null);

  const filtered = useMemo(
    () => customers.filter((c) => c.fullName.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())),
    [customers, query]
  );

  const selectedBookings = selected ? bookings.filter((b) => b.customer.email.toLowerCase() === selected.email.toLowerCase()) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-ink-500">Directory built from bookings and registered accounts.</p>
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type="text"
          placeholder="Search customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-sm border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-gold-500"
        />
      </div>

      <AdminTable columns={['Customer', 'Phone', 'Bookings', 'Last Booking', 'Registered', 'Status', '']} isEmpty={filtered.length === 0}>
        {filtered.map((c) => (
          <tr key={c.id} className="hover:bg-cream-100/50">
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{c.fullName}</p>
              <p className="text-xs text-ink-500">{c.email}</p>
            </td>
            <td className="px-4 py-3 text-ink-700">{c.phone}</td>
            <td className="px-4 py-3 text-ink-700">{c.totalBookings}</td>
            <td className="px-4 py-3 text-ink-700">{c.lastBookingDate ? formatReadableDate(c.lastBookingDate) : '—'}</td>
            <td className="px-4 py-3 text-ink-700">{c.registeredAt ? formatReadableDate(c.registeredAt) : 'Guest'}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'}`}>
                {c.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => setSelected(c)} className="text-xs font-semibold uppercase text-rose-600 hover:text-rose-700">
                View
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.fullName ?? ''}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col divide-y divide-ink/10 rounded-sm border border-ink/10">
              <Row label="Email" value={selected.email} />
              <Row label="Phone" value={selected.phone} />
              <Row label="Total Bookings" value={String(selected.totalBookings)} />
              <Row label="Registered" value={selected.registeredAt ? formatReadableDate(selected.registeredAt) : 'Guest checkout'} />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Booking History</p>
              <div className="flex flex-col divide-y divide-ink/10 rounded-sm border border-ink/10">
                {selectedBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-ink">{b.reference}</span>
                    <span className="text-ink-500">{formatReadableDate(b.date)}</span>
                    <span className="capitalize text-ink-500">{b.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={buildWhatsAppLink(`Hi ${selected.fullName}, this is DIJAH HAIR LAB.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase text-white"
              >
                <MessageCircle size={14} /> Contact via WhatsApp
              </a>
              {selected.status === 'active' ? (
                <button
                  onClick={() => {
                    deactivateCustomer(selected.id);
                    setSelected({ ...selected, status: 'deactivated' });
                  }}
                  className="rounded-sm border border-rose-200 px-4 py-2.5 text-xs font-semibold uppercase text-rose-600"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => {
                    reactivateCustomer(selected.id);
                    setSelected({ ...selected, status: 'active' });
                  }}
                  className="rounded-sm border border-green-200 px-4 py-2.5 text-xs font-semibold uppercase text-green-700"
                >
                  Reactivate
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}
