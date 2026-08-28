import { useState } from 'react';
import { Plus, Eye, EyeOff } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import StatusPill from '@/components/admin/StatusPill';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import { useAdminContent } from '@/hooks/useAdminContent';
import { formatReadableDate } from '@/utils/format';
import { CommunityPost, CommunityPostType } from '@/types';

const postTypes: CommunityPostType[] = ['announcement', 'beauty-tip', 'offer', 'featured-style'];

const emptyForm: CommunityPost = {
  id: '',
  type: 'announcement',
  title: '',
  body: '',
  published: false,
  createdAt: new Date().toISOString().slice(0, 10),
};

export default function AdminCommunity() {
  const { communityPosts, addCommunityPost, updateCommunityPost, deleteCommunityPost } = useAdminContent();
  const [editing, setEditing] = useState<CommunityPost | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyForm, id: `cp-${Date.now()}` });
    setOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    const exists = communityPosts.some((p) => p.id === editing.id);
    if (exists) updateCommunityPost(editing.id, editing);
    else addCommunityPost(editing);
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Community</h1>
          <p className="mt-1 text-sm text-ink-500">Announcements, beauty tips, offers and featured styles.</p>
        </div>
        <Button onClick={openNew} icon={<Plus size={16} />}>
          New Post
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {communityPosts.map((p) => (
          <div key={p.id} className="flex flex-col gap-2 rounded-sm border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">{p.type.replace('-', ' ')}</span>
                <h3 className="font-display text-lg font-medium text-ink">{p.title}</h3>
              </div>
              <StatusPill status={p.published ? 'published' : 'draft'} />
            </div>
            <p className="text-sm text-ink-500">{p.body}</p>
            <p className="text-[11px] text-ink-500">{formatReadableDate(p.createdAt)}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                onClick={() => updateCommunityPost(p.id, { published: !p.published })}
                className="flex items-center gap-1 text-[11px] font-semibold uppercase text-ink-700"
              >
                {p.published ? <EyeOff size={12} /> : <Eye size={12} />} {p.published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => {
                  setEditing(p);
                  setOpen(true);
                }}
                className="text-[11px] font-semibold uppercase text-ink-700 hover:text-rose-600"
              >
                Edit
              </button>
              <ConfirmButton label="Delete" onConfirm={() => deleteCommunityPost(p.id)} />
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.title ? 'Edit Post' : 'New Post'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Type</label>
              <select
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value as CommunityPostType })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm capitalize focus:border-gold-500"
              >
                {postTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Title</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Body</label>
              <textarea
                rows={4}
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="h-4 w-4" />
              Published
            </label>
            <Button onClick={handleSave} className="w-full">
              Save Post
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
