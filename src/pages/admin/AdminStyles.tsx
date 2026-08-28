import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import { useAdminCatalog } from '@/hooks/useAdminCatalog';
import { formatPrice } from '@/utils/format';
import { Style, ServiceCategory, StyleGender } from '@/types';

const categories: ServiceCategory[] = ['hair-weaving', 'womens-styling', 'mens-styling', 'dreadlocking', 'home-service', 'custom-styling'];
const genders: StyleGender[] = ['women', 'men', 'unisex'];

const emptyForm: Style = {
  id: '',
  name: '',
  serviceId: 'svc-womens-styling',
  category: 'womens-styling',
  gender: 'women',
  description: '',
  images: ['https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80'],
  durationMinutes: undefined,
  priceFrom: undefined,
  rating: 5,
  reviewCount: 0,
  isNewArrival: true,
  isPopular: false,
  isFeatured: false,
  bookable: true,
};

export default function AdminStyles() {
  const { styles, services, addStyle, updateStyle, deleteStyle } = useAdminCatalog();
  const [editing, setEditing] = useState<Style | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyForm, id: `sty-${Date.now()}` });
    setFormOpen(true);
  };
  const openEdit = (s: Style) => {
    setEditing(s);
    setFormOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    const exists = styles.some((s) => s.id === editing.id);
    if (exists) updateStyle(editing.id, editing);
    else addStyle(editing);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Styles</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the style catalogue customers browse and book.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />}>
          Add Style
        </Button>
      </div>

      <AdminTable columns={['Style', 'Category', 'Gender', 'Price', 'Tags', 'Bookable', '']} isEmpty={styles.length === 0}>
        {styles.map((s) => (
          <tr key={s.id} className="hover:bg-cream-100/50">
            <td className="flex items-center gap-3 px-4 py-3">
              <img src={s.images[0]} alt="" className="h-10 w-10 rounded-sm object-cover" />
              <p className="font-medium text-ink">{s.name}</p>
            </td>
            <td className="px-4 py-3 capitalize text-ink-700">{s.category.replace('-', ' ')}</td>
            <td className="px-4 py-3 capitalize text-ink-700">{s.gender}</td>
            <td className="px-4 py-3 text-ink-700">{formatPrice(s.priceFrom)}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {s.isFeatured && <Tag label="Featured" />}
                {s.isNewArrival && <Tag label="New" />}
                {s.isPopular && <Tag label="Popular" />}
              </div>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => updateStyle(s.id, { bookable: !s.bookable })}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  s.bookable ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'
                }`}
              >
                {s.bookable ? 'Enabled' : 'Disabled'}
              </button>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => openEdit(s)} className="text-xs font-semibold uppercase text-ink-700 hover:text-rose-600">
                  Edit
                </button>
                <ConfirmButton label="Delete" onConfirm={() => deleteStyle(s.id)} />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing?.name ? 'Edit Style' : 'Add Style'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <TextField label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Linked Service</label>
              <select
                value={editing.serviceId}
                onChange={(e) => setEditing({ ...editing, serviceId: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              >
                {services.map((sv) => (
                  <option key={sv.id} value={sv.id}>
                    {sv.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Gender</label>
                <select
                  value={editing.gender}
                  onChange={(e) => setEditing({ ...editing, gender: e.target.value as StyleGender })}
                  className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm capitalize focus:border-gold-500"
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
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
            <TextField label="Image URL" value={editing.images[0]} onChange={(v) => setEditing({ ...editing, images: [v] })} />
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
                  className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Checkbox label="Featured" checked={editing.isFeatured} onChange={(v) => setEditing({ ...editing, isFeatured: v })} />
              <Checkbox label="New arrival" checked={editing.isNewArrival} onChange={(v) => setEditing({ ...editing, isNewArrival: v })} />
              <Checkbox label="Popular" checked={editing.isPopular} onChange={(v) => setEditing({ ...editing, isPopular: v })} />
              <Checkbox label="Bookable" checked={editing.bookable} onChange={(v) => setEditing({ ...editing, bookable: v })} />
            </div>
            <Button onClick={handleSave} className="mt-2 w-full">
              Save Style
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-gold-700">{label}</span>;
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
