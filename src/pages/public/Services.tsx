import PageBanner from '@/components/public/PageBanner';
import ServiceCard from '@/components/public/ServiceCard';
import { getActiveServices } from '@/data/services';

export default function Services() {
  const allServices = getActiveServices();

  return (
    <>
      <PageBanner
        eyebrow="What We Do"
        title="Our Services"
        description="Luxury hair styling, weaving and dreadlocking — in-shop or at home, for men and women."
      />
      <section className="container-lab py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allServices.map((service) => (
            <div key={service.id} id={service.id} className="scroll-mt-24">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
