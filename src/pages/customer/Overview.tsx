import { Link } from 'react-router-dom';
import { CalendarClock, Heart, MapPin as MapPinIcon } from 'lucide-react';
import { useCustomerData } from '@/hooks/useCustomerData';
import { useWishlist } from '@/hooks/useWishlist';
import BookingRow from '@/components/customer/BookingRow';
import Button from '@/components/ui/Button';

export default function Overview() {
  const { bookings, addresses } = useCustomerData();
  const { wishlist } = useWishlist();

  const upcoming = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextAppointment = upcoming[0];

  return (
    <div className="flex flex-col gap-10">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarClock} label="Upcoming Appointments" value={upcoming.length} />
        <StatCard icon={Heart} label="Wishlisted Styles" value={wishlist.length} />
        <StatCard icon={MapPinIcon} label="Saved Addresses" value={addresses.length} />
      </div>

      {/* Upcoming appointment */}
      <div>
        <h2 className="mb-4 font-display text-xl font-medium text-ink">Upcoming Appointment</h2>
        {nextAppointment ? (
          <BookingRow booking={nextAppointment} />
        ) : (
          <div className="rounded-sm border border-dashed border-ink/15 p-8 text-center">
            <p className="text-sm text-ink-500">You don&apos;t have any upcoming appointments yet.</p>
            <div className="mt-4">
              <Button to="/booking" size="sm">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">Recent Bookings</h2>
          <Link to="/account/bookings" className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            View All
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {bookings.slice(0, 2).map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-ink/10 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-display text-2xl font-medium text-ink">{value}</p>
        <p className="text-xs text-ink-500">{label}</p>
      </div>
    </div>
  );
}
