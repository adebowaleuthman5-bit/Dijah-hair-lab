import Hero from '@/components/public/Hero';
import TrustBar from '@/components/public/TrustBar';
import ServicesSection from '@/components/public/ServicesSection';
import StyleCollections from '@/components/public/StyleCollections';
import StyleGallery from '@/components/public/StyleGallery';
import FeaturedStyles from '@/components/public/FeaturedStyles';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import AboutPreview from '@/components/public/AboutPreview';
import TestimonialsCarousel from '@/components/public/TestimonialsCarousel';
import CommunitySection from '@/components/public/CommunitySection';
import FAQAccordion from '@/components/public/FAQAccordion';
import { testimonials } from '@/data/testimonials';
import { faqs } from '@/data/faqs';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <StyleCollections />
      <StyleGallery />
      <FeaturedStyles />
      <WhyChooseUs />
      <AboutPreview />
      <TestimonialsCarousel testimonials={testimonials} />
      <CommunitySection />
      <FAQAccordion items={faqs.slice(0, 5)} eyebrow="Quick Answers" title="Common Questions" />
    </>
  );
}
