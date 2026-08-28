import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell } from 'lucide-react';
import AdminSidebarNav from '@/components/admin/AdminSidebarNav';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { roleLabels } from '@/data/admins';

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-cream-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-ink lg:block">
        <div className="border-b border-cream/10 px-5 py-5">
          <Link to="/admin" className="font-display text-lg font-medium text-cream">
            DIJAH<span className="text-gold-500">.</span> Admin
          </Link>
        </div>
        <AdminSidebarNav />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] flex lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative flex w-64 flex-col bg-ink">
            <div className="flex items-center justify-between border-b border-cream/10 px-5 py-5">
              <span className="font-display text-lg font-medium text-cream">
                DIJAH<span className="text-gold-500">.</span> Admin
              </span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-cream">
                <X size={20} />
              </button>
            </div>
            <AdminSidebarNav onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="text-ink-700 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <span className="hidden text-sm text-ink-500 sm:block">
              Signed in as <span className="font-semibold text-ink">{admin?.name}</span>
              {admin && <span className="ml-1 text-xs text-ink-500">({roleLabels[admin.role]})</span>}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="hidden text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600 sm:block">
              View Site
            </Link>
            <button aria-label="Notifications" className="text-ink-500 hover:text-rose-600">
              <Bell size={18} />
            </button>
            <Link to="/admin/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-ink">
              {admin?.name?.charAt(0) ?? 'A'}
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
