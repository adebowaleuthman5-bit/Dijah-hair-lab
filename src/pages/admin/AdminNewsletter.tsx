import { useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import StatCard from '@/components/admin/StatCard';
import { useAdminContent } from '@/hooks/useAdminContent';
import { formatReadableDate } from '@/utils/format';
import { Users, UserPlus } from 'lucide-react';

export default function AdminNewsletter() {
  const { subscribers } = useAdminContent();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => subscribers.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase())),
    [subscribers, query]
  );

  const activeCount = subscribers.filter((s) => s.status === 'active').length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const newThisMonth = subscribers.filter((s) => s.joinedAt.startsWith(thisMonth)).length;

  const handleExport = () => {
    const csv = ['Name,Email,Joined,Status', ...subscribers.map((s) => `${s.name},${s.email},${s.joinedAt},${s.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dijah-newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Newsletter</h1>
          <p className="mt-1 text-sm text-ink-500">Subscribers who joined the DIJAH HAIR LAB community list.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-sm border border-ink/15 px-4 py-2.5 text-xs font-semibold uppercase text-ink-700 hover:border-ink">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <StatCard label="Total Subscribers" value={subscribers.length} icon={Users} />
        <StatCard label="New This Month" value={newThisMonth} icon={UserPlus} tone="gold" />
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-sm border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-gold-500"
        />
      </div>

      <AdminTable columns={['Name', 'Email', 'Date Joined', 'Status']} isEmpty={filtered.length === 0}>
        {filtered.map((s) => (
          <tr key={s.id} className="hover:bg-cream-100/50">
            <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
            <td className="px-4 py-3 text-ink-700">{s.email}</td>
            <td className="px-4 py-3 text-ink-700">{formatReadableDate(s.joinedAt)}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${s.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'}`}>
                {s.status}
              </span>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
