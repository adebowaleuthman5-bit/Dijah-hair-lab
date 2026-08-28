import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import PageBanner from '@/components/public/PageBanner';

// Customer account (login/register/dashboard) is scoped for a later phase.
// This placeholder keeps every nav link functional in the meantime.
export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageBanner eyebrow="Customer Account" title={title} />
      <section className="container-lab flex flex-col items-center gap-4 py-24 text-center">
        <p className="max-w-md text-sm text-ink-500">
          The full customer account experience — bookings, wishlist and profile — is coming in the
          next phase. For now, you can book directly or reach us on WhatsApp.
        </p>
        <div className="flex gap-3">
          <Button to="/booking">Book a Service</Button>
          <Link to="/" className="flex items-center text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
