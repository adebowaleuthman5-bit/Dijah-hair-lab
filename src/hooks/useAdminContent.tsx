import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Testimonial, Review, FAQItem, CommunityPost, NewsletterSubscriber } from '@/types';
import { testimonials as seedTestimonials } from '@/data/testimonials';
import { reviews as seedReviews } from '@/data/reviews';
import { faqs as seedFaqs } from '@/data/faqs';
import { communityPosts as seedCommunity } from '@/data/community';
import { newsletterSubscribers as seedNewsletter } from '@/data/newsletter';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as contentService from '@/services/supabase/contentService';

interface AdminContentContextValue {
  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  reviews: Review[];
  updateReview: (id: string, updates: Partial<Review>) => void;

  faqs: FAQItem[];
  addFaq: (f: FAQItem) => void;
  updateFaq: (id: string, updates: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;
  reorderFaqs: (orderedIds: string[]) => void;

  communityPosts: CommunityPost[];
  addCommunityPost: (p: CommunityPost) => void;
  updateCommunityPost: (id: string, updates: Partial<CommunityPost>) => void;
  deleteCommunityPost: (id: string) => void;

  subscribers: NewsletterSubscriber[];
}

const AdminContentContext = createContext<AdminContentContextValue | undefined>(undefined);

// Dual demo/live pattern — see useAuth.tsx for the rationale.
export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(seedTestimonials);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [faqs, setFaqs] = useState<FAQItem[]>(seedFaqs);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(seedCommunity);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(seedNewsletter);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    contentService.fetchTestimonials().then((t) => t && setTestimonials(t));
    contentService.fetchReviews().then((r) => r && setReviews(r));
    contentService.fetchFaqs().then((f) => f && setFaqs(f));
    contentService.fetchCommunityPosts().then((p) => p && setCommunityPosts(p));
    contentService.fetchNewsletterSubscribers().then((s) => s && setSubscribers(s));
  }, []);

  const addTestimonial = (t: Testimonial) => {
    setTestimonials((prev) => [t, ...prev]);
    if (isSupabaseConfigured) contentService.upsertTestimonialRemote(t);
  };
  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    if (isSupabaseConfigured) {
      const updated = testimonials.find((t) => t.id === id);
      if (updated) contentService.upsertTestimonialRemote({ ...updated, ...updates });
    }
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    if (isSupabaseConfigured) contentService.deleteTestimonialRemote(id);
  };

  const updateReview = (id: string, updates: Partial<Review>) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    if (isSupabaseConfigured) contentService.updateReviewRemote(id, updates);
  };

  const addFaq = (f: FAQItem) => {
    setFaqs((prev) => [...prev, f]);
    if (isSupabaseConfigured) contentService.upsertFaqRemote(f);
  };
  const updateFaq = (id: string, updates: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    if (isSupabaseConfigured) {
      const updated = faqs.find((f) => f.id === id);
      if (updated) contentService.upsertFaqRemote({ ...updated, ...updates });
    }
  };
  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (isSupabaseConfigured) contentService.deleteFaqRemote(id);
  };
  const reorderFaqs = (orderedIds: string[]) => {
    setFaqs((prev) =>
      [...prev]
        .sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
        .map((f, idx) => ({ ...f, order: idx + 1 }))
    );
    if (isSupabaseConfigured) contentService.reorderFaqsRemote(orderedIds);
  };

  const addCommunityPost = (p: CommunityPost) => {
    setCommunityPosts((prev) => [p, ...prev]);
    if (isSupabaseConfigured) contentService.upsertCommunityPostRemote(p);
  };
  const updateCommunityPost = (id: string, updates: Partial<CommunityPost>) => {
    setCommunityPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    if (isSupabaseConfigured) {
      const updated = communityPosts.find((p) => p.id === id);
      if (updated) contentService.upsertCommunityPostRemote({ ...updated, ...updates });
    }
  };
  const deleteCommunityPost = (id: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured) contentService.deleteCommunityPostRemote(id);
  };

  return (
    <AdminContentContext.Provider
      value={{
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        reviews,
        updateReview,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        reorderFaqs,
        communityPosts,
        addCommunityPost,
        updateCommunityPost,
        deleteCommunityPost,
        subscribers,
      }}
    >
      {children}
    </AdminContentContext.Provider>
  );
}

export function useAdminContent() {
  const ctx = useContext(AdminContentContext);
  if (!ctx) throw new Error('useAdminContent must be used within AdminContentProvider');
  return ctx;
}
