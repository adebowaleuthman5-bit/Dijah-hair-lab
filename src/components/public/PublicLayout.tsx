import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import WhatsAppFloatButton from '@/components/public/WhatsAppFloatButton';
import ScrollToTop from '@/components/public/ScrollToTop';
import { loadLivePublicCatalog } from '@/lib/loadPublicCatalog';
import { initBusinessSettings } from '@/data/business';

export default function PublicLayout() {
  // A dummy state flip after live data loads. Every public page renders
  // under this component (it's the shared route layout), and the mutated
  // singletons (services, styles, faqs, testimonials, businessSettings)
  // don't trigger React updates on their own when their contents change —
  // this re-render is what makes an already-mounted page (including this
  // layout's own Footer/WhatsApp button, which read businessSettings)
  // pick up the fresh values.
  const [, forceRerender] = useState(0);

  useEffect(() => {
    Promise.all([loadLivePublicCatalog(), initBusinessSettings()]).then(([didLoadCatalog]) => {
      if (didLoadCatalog) forceRerender((n) => n + 1);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
