import { useMemo, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatusPill from '@/components/admin/StatusPill';
import Modal from '@/components/admin/Modal';
import Button from '@/components/ui/Button';
import { useAdminOps } from '@/hooks/useAdminOps';
import { getServiceById } from '@/data/services';
import { getStyleById } from '@/data/styles';
import { formatReadableDate } from '@/utils/format';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { Booking, BookingStatus } from '@/types';

const statusFilters: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'];

export default function AdminBookings() {
  const { bookings, updateBookingStatus } = useAdminOps();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => statusFilter === 'all' || b.status === statusFilter)
      .filter(
        (b) =>
          b.customer.fullName.toLowerCase().includes(query.toLowerCase()) ||
          b.reference.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, statusFilter, query]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Bookings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage every appointment across the studio.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search by name or reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-sm border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-gold-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                statusFilter === s ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-700 hover:border-ink'
              }`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        columns={['Booking ID', 'Customer', 'Service', 'Date', 'Location', 'Status', '']}
        isEmpty={filtered.length === 0}
        emptyLabel="No bookings match your filters."
      >
        {filtered.map((b) => {
          const service = getServiceById(b.serviceId);
          return (
            <tr key={b.id} className="hover:bg-cream-100/50">
              <td className="px-4 py-3 font-medium text-ink">{b.reference}</td>
              <td className="px-4 py-3 text-ink-700">{b.customer.fullName}</td>
              <td className="px-4 py-3 text-ink-700">{service?.name ?? '—'}</td>
              <td className="px-4 py-3 text-ink-700">
                {formatReadableDate(b.date)} <span className="text-ink-500">· {b.time}</span>
              </td>
              <td className="px-4 py-3 capitalize text-ink-700">{b.locationType.replace('-', ' ')}</td>
              <td className="px-4 py-3">
                <StatusPill status={b.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => setSelected(b)}
                  className="text-xs font-semibold uppercase tracking-wide text-rose-600 hover:text-rose-700"
                >
                  View
                </button>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.reference ?? ''}>
        {selected && (
          <BookingDetail
            booking={selected}
            onStatusChange={(status) => {
              updateBookingStatus(selected.id, status);
              setSelected({ ...selected, status });
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function BookingDetail({ booking, onStatusChange }: { booking: Booking; onStatusChange: (s: BookingStatus) => void }) {
  const service = getServiceById(booking.serviceId);
  const style = booking.styleId ? getStyleById(booking.styleId) : undefined;

  const actions: { label: string; status: BookingStatus }[] = [
    { label: 'Confirm', status: 'confirmed' },
    { label: 'Reject', status: 'cancelled' },
    { label: 'Mark In Progress', status: 'in-progress' },
    { label: 'Mark Completed', status: 'completed' },
    { label: 'Mark No-show', status: 'no-show' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col divide-y divide-ink/10 rounded-sm border border-ink/10">
        <Row label="Customer" value={booking.customer.fullName} />
        <Row label="Phone" value={booking.customer.phone} />
        <Row label="Email" value={booking.customer.email} />
        <Row label="Service" value={service?.name ?? '—'} />
        {style && <Row label="Style" value={style.name} />}
        <Row label="Date" value={formatReadableDate(booking.date)} />
        <Row label="Time" value={booking.time} />
        <Row label="Location" value={booking.locationType === 'in-shop' ? 'In-shop' : 'Home service'} />
        {booking.homeServiceDetails && (
          <Row label="Address" value={`${booking.homeServiceDetails.fullAddress}, ${booking.homeServiceDetails.area}`} />
        )}
        {booking.customer.specialRequest && <Row label="Special Request" value={booking.customer.specialRequest} />}
        <Row label="Status" value={booking.status.replace('-', ' ')} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.status}
              onClick={() => onStatusChange(a.status)}
              className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                booking.status === a.status ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink-700 hover:border-ink'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        href={buildWhatsAppLink(`Hi ${booking.customer.fullName}, this is DIJAH HAIR LAB regarding your booking ${booking.reference}.`)}
        target="_blank"
        variant="whatsapp"
        icon={<MessageCircle size={15} />}
      >
        Contact via WhatsApp
      </Button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <span className="text-right text-sm capitalize text-ink">{value}</span>
    </div>
  );
}
