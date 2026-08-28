import AdminTable from '@/components/admin/AdminTable';
import StatusPill from '@/components/admin/StatusPill';
import { useAdminOps } from '@/hooks/useAdminOps';
import { getServiceById } from '@/data/services';
import { formatReadableDate } from '@/utils/format';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { MessageCircle } from 'lucide-react';
import { BookingStatus } from '@/types';

export default function AdminHomeService() {
  const { bookings, updateBookingStatus } = useAdminOps();
  const homeServiceBookings = bookings
    .filter((b) => b.locationType === 'home-service')
    .sort((a, b) => b.date.localeCompare(a.date));

  const nextStatus: Record<string, BookingStatus> = {
    pending: 'confirmed',
    confirmed: 'in-progress',
    'in-progress': 'completed',
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Home Service</h1>
        <p className="mt-1 text-sm text-ink-500">Appointments requested at a customer's location.</p>
      </div>

      <AdminTable
        columns={['Customer', 'Phone', 'Address', 'Service', 'Date', 'Status', '']}
        isEmpty={homeServiceBookings.length === 0}
        emptyLabel="No home service requests yet."
      >
        {homeServiceBookings.map((b) => {
          const service = getServiceById(b.serviceId);
          const advanceTo = nextStatus[b.status];
          return (
            <tr key={b.id} className="hover:bg-cream-100/50">
              <td className="px-4 py-3 font-medium text-ink">{b.customer.fullName}</td>
              <td className="px-4 py-3 text-ink-700">{b.customer.phone}</td>
              <td className="px-4 py-3 text-ink-700">
                {b.homeServiceDetails ? `${b.homeServiceDetails.fullAddress}, ${b.homeServiceDetails.area}` : '—'}
              </td>
              <td className="px-4 py-3 text-ink-700">{service?.name ?? '—'}</td>
              <td className="px-4 py-3 text-ink-700">
                {formatReadableDate(b.date)} <span className="text-ink-500">· {b.time}</span>
              </td>
              <td className="px-4 py-3">
                <StatusPill status={b.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  {advanceTo && (
                    <button
                      onClick={() => updateBookingStatus(b.id, advanceTo)}
                      className="text-xs font-semibold uppercase text-ink-700 hover:text-rose-600"
                    >
                      {advanceTo === 'confirmed' ? 'Accept' : advanceTo === 'in-progress' ? 'Start' : 'Complete'}
                    </button>
                  )}
                  {b.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="text-xs font-semibold uppercase text-rose-600 hover:text-rose-700"
                    >
                      Reject
                    </button>
                  )}
                  <a
                    href={buildWhatsAppLink(`Hi ${b.customer.fullName}, this is DIJAH HAIR LAB regarding your home service booking ${b.reference}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact via WhatsApp"
                    className="text-green-600 hover:text-green-700"
                  >
                    <MessageCircle size={15} />
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
