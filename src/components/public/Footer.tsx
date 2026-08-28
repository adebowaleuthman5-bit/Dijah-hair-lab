import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Music2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { businessSettings, getFullAddress } from '@/data/business';
import { buildDirectionsLink } from '@/utils/maps';
import { buildWhatsAppLink } from '@/utils/whatsapp';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-lab grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <p className="max-w-xs text-sm text-cream/60">{businessSettings.tagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="eyebrow text-gold-500">Explore</h3>
          <FooterLink to="/services">Services</FooterLink>
          <FooterLink to="/styles">Styles</FooterLink>
          <FooterLink to="/booking">Book Appointment</FooterLink>
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/testimonials">Testimonials</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="eyebrow text-gold-500">Visit</h3>
          <a
            href={buildDirectionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-sm text-cream/80 hover:text-gold-400"
          >
            <MapPin size={16} className="mt-0.5 shrink-0" /> {getFullAddress()}
          </a>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream/80 hover:text-gold-400"
          >
            <Phone size={16} className="shrink-0" /> {businessSettings.whatsappNumber}
          </a>
          <a
            href={`https://www.tiktok.com/@${businessSettings.tiktokHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cream/80 hover:text-gold-400"
          >
            <Music2 size={16} className="shrink-0" /> @{businessSettings.tiktokHandle}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="eyebrow text-gold-500">Community</h3>
          <p className="text-sm text-cream/60">
            Join the DIJAH HAIR LAB community for new styles, tips and offers.
          </p>
          <Link
            to="/#community"
            className="inline-block w-fit border-b border-gold-500 pb-0.5 text-xs font-semibold uppercase tracking-wider text-gold-500"
          >
            Join the Community
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <div className="container-lab flex flex-col items-center justify-between gap-2 text-xs text-cream/40 sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} {businessSettings.businessName}. All rights reserved.
          </span>
          <span className="flex items-center gap-4">
            {getFullAddress()}
            <Link to="/admin/login" className="text-cream/20 hover:text-cream/50">
              Staff Login
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm text-cream/80 transition-colors hover:text-gold-400">
      {children}
    </Link>
  );
}
