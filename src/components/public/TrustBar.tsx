import { Sparkles, Users, Home, CalendarCheck, BadgeCheck } from 'lucide-react';

const items = [
  { icon: Sparkles, label: 'Premium Hair Styling' },
  { icon: Users, label: 'Male & Female Styles' },
  { icon: Home, label: 'Home Service Available' },
  { icon: CalendarCheck, label: 'Easy Online Booking' },
  { icon: BadgeCheck, label: 'Professional Service' },
];

export default function TrustBar() {
  return (
    <section className="border-b border-ink/10 bg-cream-100">
      <div className="container-lab grid grid-cols-2 gap-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center lg:flex-row lg:text-left">
            <Icon size={20} className="shrink-0 text-rose-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
