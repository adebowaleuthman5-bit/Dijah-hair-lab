import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Service, Style, AdminCategory, GalleryImage } from '@/types';
import { services as seedServices } from '@/data/services';
import { styles as seedStyles } from '@/data/styles';
import { adminCategories as seedCategories } from '@/data/adminCategories';
import { galleryImages as seedGallery } from '@/data/gallery';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as catalogService from '@/services/supabase/catalogService';

interface AdminCatalogContextValue {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  styles: Style[];
  addStyle: (style: Style) => void;
  updateStyle: (id: string, updates: Partial<Style>) => void;
  deleteStyle: (id: string) => void;

  categories: AdminCategory[];
  addCategory: (category: AdminCategory) => void;
  updateCategory: (id: string, updates: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;

  gallery: GalleryImage[];
  addGalleryImage: (image: GalleryImage) => void;
  updateGalleryImage: (id: string, updates: Partial<GalleryImage>) => void;
  deleteGalleryImage: (id: string) => void;
}

const AdminCatalogContext = createContext<AdminCatalogContextValue | undefined>(undefined);

// Dual demo/live pattern (see useAuth.tsx). State starts from the bundled
// seed data; if Supabase is configured, an effect replaces it with the
// real rows, and every mutation writes through to Supabase in the
// background after updating local state optimistically. In live mode,
// this is also what makes admin catalog edits actually show up on the
// public site — both now read from the same `services`/`styles` tables
// instead of separate seed copies.
export function AdminCatalogProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(seedServices);
  const [styles, setStyles] = useState<Style[]>(seedStyles);
  const [categories, setCategories] = useState<AdminCategory[]>(seedCategories);
  const [gallery, setGallery] = useState<GalleryImage[]>(seedGallery);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    catalogService.fetchServices().then((s) => s && setServices(s));
    catalogService.fetchStyles().then((s) => s && setStyles(s));
    catalogService.fetchCategories().then((c) => c && setCategories(c));
    catalogService.fetchGalleryImages().then((g) => g && setGallery(g));
  }, []);

  const addService = (service: Service) => {
    setServices((prev) => [service, ...prev]);
    if (isSupabaseConfigured) catalogService.upsertServiceRemote(service);
  };
  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (isSupabaseConfigured) {
      const updated = services.find((s) => s.id === id);
      if (updated) catalogService.upsertServiceRemote({ ...updated, ...updates });
    }
  };
  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) catalogService.deleteServiceRemote(id);
  };

  const addStyle = (style: Style) => {
    setStyles((prev) => [style, ...prev]);
    if (isSupabaseConfigured) catalogService.upsertStyleRemote(style);
  };
  const updateStyle = (id: string, updates: Partial<Style>) => {
    setStyles((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (isSupabaseConfigured) {
      const updated = styles.find((s) => s.id === id);
      if (updated) catalogService.upsertStyleRemote({ ...updated, ...updates });
    }
  };
  const deleteStyle = (id: string) => {
    setStyles((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) catalogService.deleteStyleRemote(id);
  };

  const addCategory = (category: AdminCategory) => {
    setCategories((prev) => [...prev, category]);
    if (isSupabaseConfigured) catalogService.upsertCategoryRemote(category);
  };
  const updateCategory = (id: string, updates: Partial<AdminCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (isSupabaseConfigured) {
      const updated = categories.find((c) => c.id === id);
      if (updated) catalogService.upsertCategoryRemote({ ...updated, ...updates });
    }
  };
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured) catalogService.deleteCategoryRemote(id);
  };
  const reorderCategories = (orderedIds: string[]) => {
    setCategories((prev) =>
      [...prev]
        .sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
        .map((c, idx) => ({ ...c, order: idx + 1 }))
    );
    if (isSupabaseConfigured) catalogService.reorderCategoriesRemote(orderedIds);
  };

  const addGalleryImage = (image: GalleryImage) => {
    setGallery((prev) => [image, ...prev]);
    if (isSupabaseConfigured) catalogService.upsertGalleryImageRemote(image);
  };
  const updateGalleryImage = (id: string, updates: Partial<GalleryImage>) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    if (isSupabaseConfigured) {
      const updated = gallery.find((g) => g.id === id);
      if (updated) catalogService.upsertGalleryImageRemote({ ...updated, ...updates });
    }
  };
  const deleteGalleryImage = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    if (isSupabaseConfigured) catalogService.deleteGalleryImageRemote(id);
  };

  return (
    <AdminCatalogContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        styles,
        addStyle,
        updateStyle,
        deleteStyle,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        gallery,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
      }}
    >
      {children}
    </AdminCatalogContext.Provider>
  );
}

export function useAdminCatalog() {
  const ctx = useContext(AdminCatalogContext);
  if (!ctx) throw new Error('useAdminCatalog must be used within AdminCatalogProvider');
  return ctx;
}
