import { useState } from 'react';
import { Plus, X, Star, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import Button from '@/components/ui/Button';
import { useAdminCatalog } from '@/hooks/useAdminCatalog';
import { GalleryImage } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { uploadGalleryImageFile, deleteGalleryImageFile } from '@/services/supabase/catalogService';

type AddMode = 'upload' | 'url';

export default function AdminGallery() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useAdminCatalog();
  const [addOpen, setAddOpen] = useState(false);
  // Demo mode has nowhere to actually store an uploaded file, so it
  // starts on the URL tab; live mode defaults to real uploads.
  const [mode, setMode] = useState<AddMode>(isSupabaseConfigured ? 'upload' : 'url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSelectedFile(null);
    setNewUrl('');
    setNewCaption('');
    setError(null);
  };

  const closeModal = () => {
    setAddOpen(false);
    resetForm();
  };

  const handleAdd = async () => {
    setError(null);
    let url = newUrl.trim();

    if (mode === 'upload') {
      if (!selectedFile) {
        setError('Choose an image file first.');
        return;
      }
      setUploading(true);
      const result = await uploadGalleryImageFile(selectedFile);
      setUploading(false);
      if (!result.url) {
        setError(result.error ?? 'Upload failed.');
        return;
      }
      url = result.url;
    }

    if (!url) {
      setError('Please choose a file or enter an image URL.');
      return;
    }

    const image: GalleryImage = {
      id: `gal-${Date.now()}`,
      url,
      caption: newCaption || undefined,
      featured: false,
      visibleOnHome: true,
      order: gallery.length + 1,
    };
    addGalleryImage(image);
    closeModal();
  };

  const handleDelete = (img: GalleryImage) => {
    deleteGalleryImage(img.id);
    deleteGalleryImageFile(img.url); // no-op for external/demo URLs, cleans up real uploads
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
              onClick={() => handleDelete(img)}
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

      <Modal open={addOpen} onClose={closeModal} title="Add Gallery Image">
        <div className="flex flex-col gap-4">
          <div className="flex rounded-sm border border-ink/15 p-1">
            <button
              onClick={() => setMode('upload')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-semibold uppercase tracking-wide ${
                mode === 'upload' ? 'bg-ink text-cream' : 'text-ink-700'
              }`}
            >
              <Upload size={13} /> Upload File
            </button>
            <button
              onClick={() => setMode('url')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-2 text-xs font-semibold uppercase tracking-wide ${
                mode === 'url' ? 'bg-ink text-cream' : 'text-ink-700'
              }`}
            >
              <LinkIcon size={13} /> Image URL
            </button>
          </div>

          {mode === 'upload' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Image File</label>
              {!isSupabaseConfigured && (
                <p className="rounded-sm bg-gold-50 px-3 py-2 text-[11px] text-gold-700">
                  No Supabase project connected — uploads need a live backend. Use the Image URL tab for now.
                </p>
              )}
              {selectedFile ? (
                <div className="flex items-center justify-between rounded-sm border border-ink/15 px-4 py-2.5 text-sm">
                  <span className="truncate text-ink-700">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} aria-label="Remove file" className="text-ink-500 hover:text-rose-600">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-500 hover:border-gold-500">
                  <Upload size={16} />
                  Click to choose a file (JPG, PNG, WEBP — max 5MB)
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={!isSupabaseConfigured}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Image URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Caption (optional)</label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <Button onClick={handleAdd} disabled={uploading} className="w-full" icon={uploading ? <Loader2 size={14} className="animate-spin" /> : undefined}>
            {uploading ? 'Uploading...' : 'Add to Gallery'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
