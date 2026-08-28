import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { fetchServices, fetchStyles } from '@/services/supabase/catalogService';
import { fetchFaqs, fetchTestimonials } from '@/services/supabase/contentService';
import { replaceServices } from '@/data/services';
import { replaceStyles } from '@/data/styles';
import { replaceFaqs } from '@/data/faqs';
import { replaceTestimonials } from '@/data/testimonials';

// Fetches everything the public site's read-only pages need and mutates
// the demo data singletons in place (services.ts, styles.ts, faqs.ts,
// testimonials.ts) so every component that imports those arrays directly
// — without going through a hook or context — sees live data on next
// render, with zero changes to that component's own logic.
//
// Called once from App.tsx on startup. Returns true if it actually
// fetched live data (so the caller can trigger one re-render), false in
// demo mode (nothing to do).
export async function loadLivePublicCatalog(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const [services, styles, faqs, testimonials] = await Promise.all([
    fetchServices(),
    fetchStyles(),
    fetchFaqs(),
    fetchTestimonials(),
  ]);

  if (services) replaceServices(services);
  if (styles) replaceStyles(styles);
  if (faqs) replaceFaqs(faqs);
  if (testimonials) replaceTestimonials(testimonials);

  return true;
}
