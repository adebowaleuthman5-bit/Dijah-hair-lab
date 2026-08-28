import { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import { useAdminContent } from '@/hooks/useAdminContent';
import { FAQItem } from '@/types';

const emptyForm: FAQItem = { id: '', question: '', answer: '', order: 0, published: true };

export default function AdminFaqs() {
  const { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs } = useAdminContent();
  const sorted = [...faqs].sort((a, b) => a.order - b.order);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyForm, id: `faq-${Date.now()}`, order: faqs.length + 1 });
    setOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    const exists = faqs.some((f) => f.id === editing.id);
    if (exists) updateFaq(editing.id, editing);
    else addFaq(editing);
    setOpen(false);
    setEditing(null);
  };

  const move = (id: string, direction: -1 | 1) => {
    const idx = sorted.findIndex((f) => f.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    reorderFaqs(reordered.map((f) => f.id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">FAQs</h1>
          <p className="mt-1 text-sm text-ink-500">Shared between this dashboard and the public FAQ page.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />}>
          Add FAQ
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((f, idx) => (
          <div key={f.id} className="flex items-start gap-4 rounded-sm border border-ink/10 bg-white p-4">
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => move(f.id, -1)} disabled={idx === 0} className="text-ink-500 hover:text-rose-600 disabled:opacity-20">
                <ArrowUp size={13} />
              </button>
              <button onClick={() => move(f.id, 1)} disabled={idx === sorted.length - 1} className="text-ink-500 hover:text-rose-600 disabled:opacity-20">
                <ArrowDown size={13} />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-medium text-ink">{f.question}</p>
              <p className="mt-1 text-sm text-ink-500">{f.answer}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button onClick={() => updateFaq(f.id, { published: !f.published })} className="flex items-center gap-1 text-[11px] font-semibold uppercase text-ink-700">
                  {f.published ? <Eye size={12} /> : <EyeOff size={12} />} {f.published ? 'Published' : 'Hidden'}
                </button>
                <button
                  onClick={() => {
                    setEditing(f);
                    setOpen(true);
                  }}
                  className="text-[11px] font-semibold uppercase text-ink-700 hover:text-rose-600"
                >
                  Edit
                </button>
                <ConfirmButton label="Delete" onConfirm={() => deleteFaq(f.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.question ? 'Edit FAQ' : 'Add FAQ'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Question</label>
              <input
                type="text"
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Answer</label>
              <textarea
                rows={4}
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save FAQ
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
