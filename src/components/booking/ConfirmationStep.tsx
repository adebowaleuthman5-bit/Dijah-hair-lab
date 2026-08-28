import { CheckCircle2 } from 'lucide-react';
import { Booking } from '@/types';
import { getServiceById } from '@/data/services';
import { getStyleById } from '@/data/styles';
import { getFullAddress } from '@/data/business';
import { formatReadableDate } from '@/utils/format';
import Button from '@/components/ui/Button';
import { buildDirectionsLink } from '@/utils/maps';
import { buildWhatsAppLink, buildBookingWhatsAppMessage } from '@/utils/whatsapp';
import { useAuth } from '@/hooks/useAuth';

export default function ConfirmationStep({ booking }: { booking: Booking }) {
  const service = getServiceById(booking.serviceId);
  const style = booking.styleId ? getStyleById(booking.styleId) : undefined;
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <CheckCircle2 size={32} />
      </span>
      <div>
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">Booking Confirmed</h2>
        <p className="mt-2 text-sm text-ink-500">
          We&apos;ve received your request. Your reference number is below.
        </p>
      </div>

      <div className="w-full max-w-md rounded-sm border border-gold-200 bg-gold-50 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Booking Reference</p>
        <p className="mt-1 font-display text-xl font-medium text-ink">{booking.reference}</p>
      </div>

      <div className="flex w-full max-w-md flex-col divide-y divide-ink/10 rounded-sm border border-ink/10 text-left">
        <Row label="Service" value={service?.name ?? '—'} />
        {style && <Row label="Style" value={style.name} />}
        <Row label="Date" value={formatReadableDate(booking.date)} />
        <Row label="Time" value={booking.time} />
        <Row
          label="Location"
          value={booking.locationType === 'in-shop' ? `In-Shop — ${getFullAddress()}` : 'Home Service'}
        />
        <Row label="Customer" value={booking.customer.fullName} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button to="/account" variant="outline">
          View My Booking
        </Button>
        <Button
          href={buildWhatsAppLink(
            buildBookingWhatsAppMessage(
              { ...booking, styleId: booking.styleId, customer: booking.customer },
              service?.name,
              style?.name
            )
          )}
          target="_blank"
          variant="whatsapp"
        >
          WhatsApp Us
        </Button>
        <Button href={buildDirectionsLink()} target="_blank" variant="secondary">
          Get Directions
        </Button>
      </div>

      {!isAuthenticated && (
        <div className="mt-2 flex max-w-md flex-col items-center gap-2 rounded-sm border border-gold-200 bg-gold-50 px-5 py-4 text-center">
          <p className="text-sm text-ink-700">
            Create an account to track this booking, reschedule easily, and save your favorite styles.
          </p>
          <Button to="/register" size="sm" variant="secondary">
            Create Account
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}
