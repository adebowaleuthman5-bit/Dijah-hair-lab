import { useState } from 'react';
import { Plus, Star, EyeOff, Eye } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/ui/RatingStars';
import { useAdminContent } from '@/hooks/useAdminContent';
import { formatReadableDate } from '@/utils/format';
import { Testimonial } from '@/types';

const emptyForm: Testimonial = {
  id: '',
  customerName: '',
  location: '',
  rating: 5,
  review: '',
  service: '',
  date: new Date().toISOString().slice(0, 10),
  isDemo: false,
  approved: true,
  featured: false,
};

export default function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminContent();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyForm, id: `tst-${Date.now()}` });
    setOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    const exists = testimonials.some((t) => t.id === editing.id);
    if (exists) updateTestimonial(editing.id, editing);
    else addTestimonial(editing);
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-500">Curated quotes shown across the public site.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />}>
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="flex flex-col gap-3 rounded-sm border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{t.customerName}</p>
                <p className="text-xs text-ink-500">{[t.service, t.location].filter(Boolean).join(' · ')}</p>
              </div>
              {t.isDemo && <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-gold-700">Demo</span>}
            </div>
            <RatingStars rating={t.rating} />
            <p className="text-sm leading-relaxed text-ink-500">&ldquo;{t.review}&rdquo;</p>
            <p className="text-[11px] text-ink-500">{formatReadableDate(t.date)}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => updateTestimonial(t.id, { featured: !t.featured })} className="flex items-center gap-1 text-[11px] font-semibold uppercase text-gold-700">
                <Star size={12} className={t.featured ? 'fill-gold-600' : ''} /> {t.featured ? 'Featured' : 'Feature'}
              </button>
              <button onClick={() => updateTestimonial(t.id, { approved: !t.approved })} className="flex items-center gap-1 text-[11px] font-semibold uppercase text-ink-700">
                {t.approved ? <Eye size={12} /> : <EyeOff size={12} />} {t.approved ? 'Visible' : 'Hidden'}
              </button>
              <button onClick={() => openEdit(t)} className="text-[11px] font-semibold uppercase text-ink-700 hover:text-rose-600">
                Edit
              </button>
              <ConfirmButton label="Delete" onConfirm={() => deleteTestimonial(t.id)} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.customerName ? 'Edit Testimonial' : 'Add Testimonial'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <TextField label="Customer Name" value={editing.customerName} onChange={(v) => setEditing({ ...editing, customerName: v })} />
            <TextField label="Location" value={editing.location ?? ''} onChange={(v) => setEditing({ ...editing, location: v })} />
            <TextField label="Service" value={editing.service ?? ''} onChange={(v) => setEditing({ ...editing, service: v })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Review</label>
              <textarea
                rows={3}
                value={editing.review}
                onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Rating</label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.5}
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={editing.isDemo} onChange={(e) => setEditing({ ...editing, isDemo: e.target.checked })} className="h-4 w-4" />
              Mark as demo content
            </label>
            <Button onClick={handleSave} className="w-full">
              Save Testimonial
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
