import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

// Official DIJAH HAIR LAB logo (background removed from the supplied photo,
// cropped tight to the mark). Used everywhere via this one component, so
// swapping to a higher-res or vector version later only requires changing
// this file.
export default function Logo({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? 'text-cream' : 'text-ink';
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="DIJAH HAIR LAB home">
      <img src={logoImg} alt="DIJAH HAIR LAB" className="h-10 w-auto object-contain sm:h-12" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-medium tracking-tight ${textColor} sm:text-xl`}>
          DIJAH
        </span>
        <span className={`font-body text-[9px] font-semibold uppercase tracking-widest2 ${dark ? 'text-cream/60' : 'text-ink-500'}`}>
          Hair Lab
        </span>
      </span>
    </Link>
  );
}
