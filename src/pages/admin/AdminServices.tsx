import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import { useAdminCatalog } from '@/hooks/useAdminCatalog';
import { formatDuration, formatPrice } from '@/utils/format';
import { Service, ServiceCategory } from '@/types';

const categories: ServiceCategory[] = ['hair-weaving', 'womens-styling', 'mens-styling', 'dreadlocking', 'home-service', 'custom-styling'];

const emptyForm: Service = {
  id: '',
  name: '',
  category: 'womens-styling',
  description: '',
  image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
  durationMinutes: undefined,
  priceFrom: undefined,
  homeServiceAvailable: true,
  featured: false,
  active: true,
};

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useAdminCatalog();
  const [editing, setEditing] = useState<Service | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyForm, id: `svc-${Date.now()}` });
    setFormOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!editing) return;
    const exists = services.some((s) => s.id === editing.id);
    if (exists) updateService(editing.id, editing);
    else addService(editing);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Services</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the services offered on the public site.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />}>
          Add Service
        </Button>
      </div>

      <AdminTable columns={['Service', 'Category', 'Duration', 'Price', 'Status', '']} isEmpty={services.length === 0}>
        {services.map((s) => (
          <tr key={s.id} className="hover:bg-cream-100/50">
            <td className="flex items-center gap-3 px-4 py-3">
              <img src={s.image} alt="" className="h-10 w-10 rounded-sm object-cover" />
              <div>
                <p className="font-medium text-ink">{s.name}</p>
                {s.featured && <span className="text-[10px] font-semibold uppercase text-gold-600">Featured</span>}
              </div>
            </td>
            <td className="px-4 py-3 capitalize text-ink-700">{s.category.replace('-', ' ')}</td>
            <td className="px-4 py-3 text-ink-700">{formatDuration(s.durationMinutes) ?? '—'}</td>
            <td className="px-4 py-3 text-ink-700">{formatPrice(s.priceFrom)}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => updateService(s.id, { active: !s.active })}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  s.active ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'
                }`}
              >
                {s.active ? 'Active' : 'Disabled'}
              </button>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => openEdit(s)} className="text-xs font-semibold uppercase text-ink-700 hover:text-rose-600">
                  Edit
                </button>
                <ConfirmButton label="Delete" onConfirm={() => deleteService(s.id)} />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?.name ? 'Edit Service' : 'Add Service'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <TextField label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as ServiceCategory })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm capitalize focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Description</label>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <TextField label="Image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Duration (minutes)</label>
                <input
                  type="number"
                  value={editing.durationMinutes ?? ''}
                  onChange={(e) => setEditing({ ...editing, durationMinutes: e.target.value ? Number(e.target.value) : undefined })}
                  className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Price (NGN, optional)</label>
                <input
                  type="number"
                  value={editing.priceFrom ?? ''}
                  onChange={(e) => setEditing({ ...editing, priceFrom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Leave blank for 'Contact us'"
                  className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Checkbox label="Home service available" checked={editing.homeServiceAvailable} onChange={(v) => setEditing({ ...editing, homeServiceAvailable: v })} />
              <Checkbox label="Featured" checked={editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              <Checkbox label="Active" checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
            </div>
            <Button onClick={handleSave} className="mt-2 w-full">
              Save Service
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  );
}
