import { FormEvent, useState } from 'react';
import { MapPin, Phone, Music2, Clock, CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { businessSettings, getFullAddress } from '@/data/business';
import { buildDirectionsLink, buildMapsEmbedSrc } from '@/utils/maps';
import { buildWhatsAppLink } from '@/utils/whatsapp';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    // Demo-only submission; wire to a real endpoint later.
    setSubmitted(true);
  };

  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow="Get In Touch" title="Contact DIJAH HAIR LAB" align="left" />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Info + map */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-sm border border-ink/10 p-6">
            <InfoRow icon={MapPin} label={getFullAddress()} />
            <InfoRow icon={Phone} label={businessSettings.whatsappNumber} />
            <InfoRow icon={Music2} label={`@${businessSettings.tiktokHandle}`} />
            <InfoRow
              icon={Clock}
              label={
                businessSettings.businessHours
                  ? 'See hours below'
                  : 'Business hours to be confirmed — message us on WhatsApp'
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={buildWhatsAppLink()} target="_blank" variant="whatsapp">
              WhatsApp Us
            </Button>
            <Button href={buildDirectionsLink()} target="_blank" variant="outline">
              Get Directions
            </Button>
            <Button to="/booking" variant="secondary">
              Book Appointment
            </Button>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-sm border border-ink/10">
            <iframe
              title="DIJAH HAIR LAB location"
              src={buildMapsEmbedSrc()}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="rounded-sm border border-ink/10 p-6 sm:p-8">
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <CheckCircle2 size={32} className="text-gold-500" />
              <p className="font-display text-lg text-ink">Message sent</p>
              <p className="max-w-xs text-sm text-ink-500">
                Thanks, {name.split(' ')[0]}. We&apos;ll get back to you soon — for a faster reply,
                message us on WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Full name" value={name} onChange={setName} required />
              <Field label="Email" type="email" value={email} onChange={setEmail} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
                />
              </div>
              <Button type="submit" className="mt-2 w-full sm:w-fit">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-ink-700">
      <Icon size={17} className="mt-0.5 shrink-0 text-rose-600" />
      <span>{label}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
      />
    </div>
  );
}
