import { Gem, ShieldCheck, Home, Smile } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

const reasons = [
  {
    icon: Gem,
    title: 'Premium Styling',
    text: 'Every service is delivered with editorial-level precision and a finish built to last.',
  },
  {
    icon: ShieldCheck,
    title: 'Professional Service',
    text: 'Skilled stylists, hygienic practice and consultations tailored to your hair and goals.',
  },
  {
    icon: Home,
    title: 'Home Service',
    text: 'The full DIJAH HAIR LAB experience, brought to your doorstep anywhere in Lagos.',
  },
  {
    icon: Smile,
    title: 'Customer Satisfaction',
    text: 'We build long-term relationships, not one-time visits — your comfort comes first.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow="Our Promise" title="Why DIJAH HAIR LAB?" align="center" />

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
              <Icon size={24} />
            </span>
            <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
