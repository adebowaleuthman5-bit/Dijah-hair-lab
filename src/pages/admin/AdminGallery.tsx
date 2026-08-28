import { useState } from 'react';
import { Plus, X, Star } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import Button from '@/components/ui/Button';
import { useAdminCatalog } from '@/hooks/useAdminCatalog';
import { GalleryImage } from '@/types';

export default function AdminGallery() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useAdminCatalog();
  const [addOpen, setAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAdd = () => {
    if (!newUrl) return;
    const image: GalleryImage = {
      id: `gal-${Date.now()}`,
      url: newUrl,
      caption: newCaption || undefined,
      featured: false,
      visibleOnHome: true,
      order: gallery.length + 1,
    };
    addGalleryImage(image);
    setNewUrl('');
    setNewCaption('');
    setAddOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Gallery</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the editorial style gallery shown on the public site.</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>
          Upload Image
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-sm border border-ink/10 bg-white">
            <div className="aspect-square overflow-hidden">
              <img src={img.url} alt={img.caption ?? ''} className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => updateGalleryImage(img.id, { featured: !img.featured })}
              className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full ${
                img.featured ? 'bg-gold-500 text-ink' : 'bg-white/90 text-ink-500'
              }`}
              aria-label="Toggle featured"
            >
              <Star size={13} className={img.featured ? 'fill-ink' : ''} />
            </button>
            <button
              onClick={() => deleteGalleryImage(img.id)}
              className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-500 opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100"
              aria-label="Delete image"
            >
              <X size={13} />
            </button>
            <div className="p-2.5">
              <p className="truncate text-xs text-ink-700">{img.caption ?? 'Untitled'}</p>
              <label className="mt-1.5 flex items-center gap-1.5 text-[10px] text-ink-500">
                <input
                  type="checkbox"
                  checked={img.visibleOnHome}
                  onChange={(e) => updateGalleryImage(img.id, { visibleOnHome: e.target.checked })}
                  className="h-3 w-3"
                />
                Show on homepage
              </label>
            </div>
          </div>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Upload Gallery Image">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Image URL</label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
            <p className="text-[11px] text-ink-500">
              File upload UI is ready for Supabase Storage integration — for now, paste an image URL.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Caption (optional)</label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
          </div>
          <Button onClick={handleAdd} className="w-full">
            Add to Gallery
          </Button>
        </div>
      </Modal>
    </div>
  );
}
