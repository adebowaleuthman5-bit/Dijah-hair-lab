import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/public/ServiceCard';
import { getFeaturedServices } from '@/data/services';

export default function ServicesSection() {
  const featured = getFeaturedServices();

  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow="What We Do" title="Our Signature Services" align="left" />
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
