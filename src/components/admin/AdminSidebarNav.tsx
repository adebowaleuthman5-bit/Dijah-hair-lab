import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarClock,
  Calendar,
  Clock,
  Sparkles,
  Image as ImageIcon,
  LayoutGrid,
  Users,
  Images,
  Star,
  MessageSquareQuote,
  Mail,
  Users2,
  Home,
  CreditCard,
  HelpCircle,
  Share2,
  Settings,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Bookings',
    items: [
      { label: 'Bookings', to: '/admin/bookings', icon: CalendarClock },
      { label: 'Calendar', to: '/admin/calendar', icon: Calendar },
      { label: 'Availability', to: '/admin/availability', icon: Clock },
      { label: 'Home Service', to: '/admin/home-service', icon: Home },
      { label: 'Payments', to: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Services', to: '/admin/services', icon: Sparkles },
      { label: 'Styles', to: '/admin/styles', icon: LayoutGrid },
      { label: 'Categories', to: '/admin/categories', icon: ImageIcon },
      { label: 'Gallery', to: '/admin/gallery', icon: Images },
    ],
  },
  {
    label: 'People',
    items: [{ label: 'Customers', to: '/admin/customers', icon: Users }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Reviews', to: '/admin/reviews', icon: Star },
      { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'Newsletter', to: '/admin/newsletter', icon: Mail },
      { label: 'Community', to: '/admin/community', icon: Users2 },
      { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Social Media', to: '/admin/social-media', icon: Share2 },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', to: '/admin/settings', icon: Settings },
      { label: 'Admin Users', to: '/admin/users', icon: ShieldCheck },
      { label: 'Profile', to: '/admin/profile', icon: UserCircle },
    ],
  },
];

export default function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest2 text-cream/40">
            {group.label}
          </span>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-gold-500 text-ink font-semibold' : 'text-cream/80 hover:bg-cream/10'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
