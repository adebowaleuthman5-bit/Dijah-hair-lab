import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, User, Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Styles', to: '/styles' },
  { label: 'Book Appointment', to: '/booking' },
  { label: 'About', to: '/about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { wishlist } = useWishlist();
  const { isAuthenticated, customer } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-cream/95 shadow-soft backdrop-blur-sm' : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-lab flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-wider transition-colors hover:text-rose-600 ${
                  isActive ? 'text-rose-600' : 'text-ink-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button aria-label="Search" className="text-ink-700 transition-colors hover:text-rose-600">
            <Search size={19} />
          </button>
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="relative text-ink-700 transition-colors hover:text-rose-600"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label="Account"
            className="text-ink-700 transition-colors hover:text-rose-600"
          >
            {isAuthenticated && customer ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink">
                {customer.fullName.charAt(0)}
              </span>
            ) : (
              <User size={19} />
            )}
          </Link>
          <Button to="/booking" size="sm">
            Book Now
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button to="/booking" size="sm">
            Book
          </Button>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-ink/10 bg-cream lg:hidden" aria-label="Mobile">
          <div className="container-lab flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-sm px-2 py-3 text-sm font-semibold uppercase tracking-wide ${
                    isActive ? 'bg-gold-50 text-rose-600' : 'text-ink-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-4 border-t border-ink/10 px-2 pt-4">
              <Link to="/account/wishlist" className="flex items-center gap-2 text-sm text-ink-700">
                <Heart size={17} /> Wishlist
              </Link>
              <Link to={isAuthenticated ? '/account' : '/login'} className="flex items-center gap-2 text-sm text-ink-700">
                <User size={17} /> {isAuthenticated ? 'Account' : 'Login'}
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
