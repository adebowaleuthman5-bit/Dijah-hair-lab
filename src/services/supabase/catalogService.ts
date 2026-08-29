import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Service, Style, AdminCategory, GalleryImage } from '@/types';

// ---------- Services ----------

export async function fetchServices(): Promise<Service[] | null> {
  if (!isSupabaseConfigured || !supabase) return null; // null = "use demo data instead"
  const { data, error } = await supabase.from('services').select('*').order('created_at');
  if (error || !data) return null;
  return data.map(mapServiceRow);
}

export async function upsertServiceRemote(service: Service): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('services').upsert({
    id: service.id,
    name: service.name,
    category: service.category,
    description: service.description,
    image: service.image,
    duration_minutes: service.durationMinutes ?? null,
    price_from: service.priceFrom ?? null,
    home_service_available: service.homeServiceAvailable,
    featured: service.featured,
    active: service.active,
  });
}

export async function deleteServiceRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('services').delete().eq('id', id);
}

function mapServiceRow(row: any): Service {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    image: row.image,
    durationMinutes: row.duration_minutes ?? undefined,
    priceFrom: row.price_from ?? undefined,
    homeServiceAvailable: row.home_service_available,
    featured: row.featured,
    active: row.active,
  };
}

// ---------- Styles ----------

export async function fetchStyles(): Promise<Style[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('styles').select('*').order('created_at');
  if (error || !data) return null;
  return data.map(mapStyleRow);
}

export async function upsertStyleRemote(style: Style): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('styles').upsert({
    id: style.id,
    name: style.name,
    service_id: style.serviceId,
    category: style.category,
    gender: style.gender,
    description: style.description,
    images: style.images,
    duration_minutes: style.durationMinutes ?? null,
    price_from: style.priceFrom ?? null,
    rating: style.rating,
    review_count: style.reviewCount,
    is_new_arrival: style.isNewArrival,
    is_popular: style.isPopular,
    is_featured: style.isFeatured,
    bookable: style.bookable,
  });
}

export async function deleteStyleRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('styles').delete().eq('id', id);
}

function mapStyleRow(row: any): Style {
  return {
    id: row.id,
    name: row.name,
    serviceId: row.service_id,
    category: row.category,
    gender: row.gender,
    description: row.description,
    images: row.images ?? [],
    durationMinutes: row.duration_minutes ?? undefined,
    priceFrom: row.price_from ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    isNewArrival: row.is_new_arrival,
    isPopular: row.is_popular,
    isFeatured: row.is_featured,
    bookable: row.bookable,
  };
}

// ---------- Categories ----------

export async function fetchCategories(): Promise<AdminCategory[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error || !data) return null;
  return data.map(mapCategoryRow);
}

export async function upsertCategoryRemote(category: AdminCategory): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('categories').upsert({
    id: category.id,
    slug: category.slug,
    label: category.label,
    description: category.description,
    image: category.image,
    sort_order: category.order,
    active: category.active,
  });
}

export async function deleteCategoryRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('categories').delete().eq('id', id);
}

export async function reorderCategoriesRemote(orderedIds: string[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await Promise.all(orderedIds.map((id, idx) => supabase!.from('categories').update({ sort_order: idx + 1 }).eq('id', id)));
}

function mapCategoryRow(row: any): AdminCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    description: row.description,
    image: row.image,
    order: row.sort_order,
    active: row.active,
  };
}

// ---------- Gallery ----------

const GALLERY_MAX_FILE_MB = 5;
const GALLERY_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Uploads a file to the "gallery" Storage bucket (see
// supabase/migrations/0010_storage.sql for the bucket + policies) and
// returns its public URL, ready to store as a gallery_images.url value.
// Returns an error string instead of throwing so the caller can show it
// inline without a try/catch.
export async function uploadGalleryImageFile(file: File): Promise<{ url: string | null; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { url: null, error: 'Supabase is not configured — connect a project to enable real uploads.' };
  }
  if (!GALLERY_ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Please upload a JPG, PNG or WEBP image.' };
  }
  if (file.size > GALLERY_MAX_FILE_MB * 1024 * 1024) {
    return { url: null, error: `File must be under ${GALLERY_MAX_FILE_MB}MB.` };
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from('gallery').getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteGalleryImageFile(url: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  // Only attempt to remove files that actually live in our own bucket —
  // seed/demo rows point at external Unsplash URLs, which aren't ours to delete.
  const marker = '/storage/v1/object/public/gallery/';
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from('gallery').remove([path]);
}

export async function fetchGalleryImages(): Promise<GalleryImage[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('gallery_images').select('*').order('sort_order');
  if (error || !data) return null;
  return data.map(mapGalleryRow);
}

export async function upsertGalleryImageRemote(image: GalleryImage): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('gallery_images').upsert({
    id: image.id,
    url: image.url,
    caption: image.caption ?? null,
    category: image.category ?? null,
    featured: image.featured,
    visible_on_home: image.visibleOnHome,
    sort_order: image.order,
  });
}

export async function deleteGalleryImageRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('gallery_images').delete().eq('id', id);
}

function mapGalleryRow(row: any): GalleryImage {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption ?? undefined,
    category: row.category ?? undefined,
    featured: row.featured,
    visibleOnHome: row.visible_on_home,
    order: row.sort_order,
  };
}
