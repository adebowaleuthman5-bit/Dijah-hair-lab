import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarClock,
  Heart,
  MapPin,
  User,
  Bell,
  LogOut,
} from 'lucide-react';
import PageBanner from '@/components/public/PageBanner';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerData } from '@/hooks/useCustomerData';

const navItems = [
  { to: '/account', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/account/bookings', label: 'My Bookings', icon: CalendarClock },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
];

export default function AccountLayout() {
  const { customer, logout } = useAuth();
  const { unreadCount } = useCustomerData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <PageBanner eyebrow="My Account" title={`Welcome back, ${customer?.fullName.split(' ')[0]}`} />

      <section className="container-lab flex flex-col gap-8 py-12 lg:flex-row lg:py-16">
        <aside className="lg:w-64 lg:shrink-0">
          <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 whitespace-nowrap rounded-sm px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-ink text-cream' : 'text-ink-700 hover:bg-cream-100'
                  }`
                }
              >
                <Icon size={16} />
                {label}
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-sm px-4 py-3 text-sm font-medium text-ink-500 hover:bg-rose-50 hover:text-rose-600 lg:mt-4"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </section>
    </>
  );
}
