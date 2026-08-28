import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, RefreshCw, XCircle } from 'lucide-react';
import { Booking } from '@/types';
import { getServiceById } from '@/data/services';
import { getStyleById } from '@/data/styles';
import { formatReadableDate } from '@/utils/format';
import { getFullAddress } from '@/data/business';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import BookingStatusBadge from '@/components/customer/BookingStatusBadge';
import RescheduleModal from '@/components/customer/RescheduleModal';
import { useCustomerData } from '@/hooks/useCustomerData';

export default function BookingRow({ booking }: { booking: Booking }) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { cancelBooking, rescheduleBooking } = useCustomerData();

  const service = getServiceById(booking.serviceId);
  const style = booking.styleId ? getStyleById(booking.styleId) : undefined;
  const canModify = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-ink/10 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        {style && (
          <img src={style.images[0]} alt={style.name} className="h-16 w-16 shrink-0 rounded-sm object-cover" />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-base font-medium text-ink">{style?.name ?? service?.name}</p>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-1 text-xs text-ink-500">Ref: {booking.reference}</p>
          <p className="mt-1 text-xs text-ink-500">
            {formatReadableDate(booking.date)} · {booking.time}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
            <MapPin size={12} />
            {booking.locationType === 'in-shop' ? getFullAddress() : booking.homeServiceDetails?.fullAddress ?? 'Home service'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
        {style && (
          <Link to={`/styles/${style.id}`} className="text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600">
            View Style
          </Link>
        )}
        {canModify && (
          <>
            <button
              onClick={() => setShowReschedule(true)}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-700 hover:text-gold-600"
            >
              <RefreshCw size={12} /> Reschedule
            </button>
            {confirmCancel ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-ink-500">Cancel booking?</span>
                <button
                  onClick={() => {
                    cancelBooking(booking.id);
                    setConfirmCancel(false);
                  }}
                  className="font-semibold text-rose-600"
                >
                  Yes
                </button>
                <button onClick={() => setConfirmCancel(false)} className="text-ink-500">
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600"
              >
                <XCircle size={12} /> Cancel
              </button>
            )}
          </>
        )}
        <a
          href={buildWhatsAppLink(`Hi, I'd like to ask about my booking ${booking.reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#25D366] hover:opacity-80"
        >
          <MessageCircle size={12} /> WhatsApp Us
        </a>
      </div>

      {showReschedule && (
        <RescheduleModal
          booking={booking}
          onClose={() => setShowReschedule(false)}
          onConfirm={(date, time) => {
            rescheduleBooking(booking.id, date, time);
            setShowReschedule(false);
          }}
        />
      )}
    </div>
  );
}
