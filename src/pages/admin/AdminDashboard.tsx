import { CalendarClock, Clock3, CheckCircle2, XCircle, Users, UserPlus, Sparkles, Wallet } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import MiniBarChart from '@/components/admin/MiniBarChart';
import MiniLineChart from '@/components/admin/MiniLineChart';
import { useAdminOps } from '@/hooks/useAdminOps';
import { getStyleById } from '@/data/styles';

const nairaFormatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

export default function AdminDashboard() {
  const { bookings, customers, payments } = useAdminOps();

  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.date === today);
  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');
  const cancelled = bookings.filter((b) => b.status === 'cancelled' || b.status === 'no-show');

  const thisMonth = today.slice(0, 7);
  const newCustomersThisMonth = customers.filter((c) => c.lastBookingDate?.startsWith(thisMonth)).length;

  const todaysRevenue = payments
    .filter((p) => p.date === today && p.status === 'successful')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const monthlyRevenue = payments
    .filter((p) => p.date.startsWith(thisMonth) && p.status === 'successful')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // Bookings by status for the bar chart
  const statusChartData = [
    { label: 'Pending', value: pending.length },
    { label: 'Confirmed', value: confirmed.length },
    { label: 'Completed', value: completed.length },
    { label: 'Cancelled', value: cancelled.length },
  ];

  // Popular styles: count bookings per style
  const styleCounts = new Map<string, number>();
  bookings.forEach((b) => {
    if (b.styleId) styleCounts.set(b.styleId, (styleCounts.get(b.styleId) ?? 0) + 1);
  });
  const popularStyles = Array.from(styleCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([styleId, count]) => ({ label: getStyleById(styleId)?.name ?? styleId, value: count }));

  // Customer growth: bookings count per month (last 4 months present in demo data)
  const monthCounts = new Map<string, number>();
  bookings.forEach((b) => {
    const month = b.date.slice(0, 7);
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
  });
  const monthlyTrend = Array.from(monthCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({
      label: new Date(month + '-01').toLocaleDateString('en-GB', { month: 'short' }),
      value: count,
    }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">A snapshot of DIJAH HAIR LAB right now.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Today's Bookings" value={todaysBookings.length} icon={CalendarClock} tone="violet" />
        <StatCard label="Pending" value={pending.length} icon={Clock3} tone="gold" />
        <StatCard label="Confirmed" value={confirmed.length} icon={CheckCircle2} tone="violet" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} tone="default" />
        <StatCard label="Cancelled / No-show" value={cancelled.length} icon={XCircle} tone="rose" />
        <StatCard label="Total Customers" value={customers.length} icon={Users} tone="default" />
        <StatCard label="New This Month" value={newCustomersThisMonth} icon={UserPlus} tone="gold" />
        <StatCard label="Popular Style" value={popularStyles[0]?.label.split(' ')[0] ?? '—'} icon={Sparkles} tone="violet" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Today's Revenue" value={nairaFormatter.format(todaysRevenue)} icon={Wallet} tone="gold" hint="Demo revenue data" />
        <StatCard label="Monthly Revenue" value={nairaFormatter.format(monthlyRevenue)} icon={Wallet} tone="gold" hint="Demo revenue data" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-display text-base font-medium text-ink">Bookings by Status</h2>
          <MiniBarChart data={statusChartData} tone="violet" />
        </div>
        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-display text-base font-medium text-ink">Booking Volume Trend</h2>
          <MiniLineChart data={monthlyTrend} color="#D9A94E" />
        </div>
        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-display text-base font-medium text-ink">Popular Styles</h2>
          {popularStyles.length > 0 ? (
            <MiniBarChart data={popularStyles} tone="rose" />
          ) : (
            <p className="text-sm text-ink-500">Not enough booking data yet.</p>
          )}
        </div>
        <div className="rounded-sm border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-display text-base font-medium text-ink">Customer Growth</h2>
          <MiniLineChart data={monthlyTrend} color="#6B5B95" />
        </div>
      </div>
    </div>
  );
}
