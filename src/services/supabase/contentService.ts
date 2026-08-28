import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { FAQItem, Testimonial, Review, CommunityPost, NewsletterSubscriber } from '@/types';

// ---------- FAQs ----------

export async function fetchFaqs(): Promise<FAQItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order');
  if (error || !data) return null;
  return data.map((r: any): FAQItem => ({ id: r.id, question: r.question, answer: r.answer, order: r.sort_order, published: r.published }));
}

export async function upsertFaqRemote(faq: FAQItem): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('faqs').upsert({ id: faq.id, question: faq.question, answer: faq.answer, sort_order: faq.order, published: faq.published });
}

export async function deleteFaqRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('faqs').delete().eq('id', id);
}

export async function reorderFaqsRemote(orderedIds: string[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await Promise.all(orderedIds.map((id, idx) => supabase!.from('faqs').update({ sort_order: idx + 1 }).eq('id', id)));
}

// ---------- Testimonials ----------

export async function fetchTestimonials(): Promise<Testimonial[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('testimonials').select('*').order('occurred_on', { ascending: false });
  if (error || !data) return null;
  return data.map(mapTestimonialRow);
}

export async function upsertTestimonialRemote(t: Testimonial): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('testimonials').upsert({
    id: t.id,
    customer_name: t.customerName,
    location: t.location ?? null,
    rating: t.rating,
    review: t.review,
    service: t.service ?? null,
    occurred_on: t.date,
    photo: t.photo ?? null,
    is_demo: t.isDemo,
    approved: t.approved,
    featured: t.featured,
  });
}

export async function deleteTestimonialRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('testimonials').delete().eq('id', id);
}

function mapTestimonialRow(row: any): Testimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    location: row.location ?? undefined,
    rating: Number(row.rating),
    review: row.review,
    service: row.service ?? undefined,
    date: row.occurred_on,
    photo: row.photo ?? undefined,
    isDemo: row.is_demo,
    approved: row.approved,
    featured: row.featured,
  };
}

// ---------- Reviews ----------

export async function fetchReviews(): Promise<Review[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('reviews').select('*').order('review_date', { ascending: false });
  if (error || !data) return null;
  return data.map(
    (r: any): Review => ({
      id: r.id,
      customerName: r.customer_name,
      rating: Number(r.rating),
      review: r.review,
      service: r.service ?? undefined,
      date: r.review_date,
      verified: r.verified,
      status: r.status,
      visible: r.visible,
    })
  );
}

export async function updateReviewRemote(id: string, updates: Partial<Review>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const patch: Record<string, unknown> = {};
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  await supabase.from('reviews').update(patch).eq('id', id);
}

// ---------- Community posts ----------

export async function fetchCommunityPosts(): Promise<CommunityPost[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
  if (error || !data) return null;
  return data.map(
    (r: any): CommunityPost => ({ id: r.id, type: r.type, title: r.title, body: r.body, published: r.published, createdAt: r.created_at })
  );
}

export async function upsertCommunityPostRemote(post: CommunityPost): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('community_posts').upsert({ id: post.id, type: post.type, title: post.title, body: post.body, published: post.published });
}

export async function deleteCommunityPostRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.from('community_posts').delete().eq('id', id);
}

// ---------- Newsletter ----------

export async function fetchNewsletterSubscribers(): Promise<NewsletterSubscriber[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('joined_at', { ascending: false });
  if (error || !data) return null;
  return data.map(
    (r: any): NewsletterSubscriber => ({ id: r.id, name: r.name, email: r.email, joinedAt: r.joined_at, status: r.status })
  );
}

export async function subscribeToNewsletterRemote(name: string, email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Supabase is not configured.' };
  const { error } = await supabase.from('newsletter_subscribers').insert({ name, email });
  return error ? { success: false, error: error.message } : { success: true };
}
