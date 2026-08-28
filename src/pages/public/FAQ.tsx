import PageBanner from '@/components/public/PageBanner';
import FAQAccordion from '@/components/public/FAQAccordion';
import { faqs } from '@/data/faqs';

export default function FAQ() {
  return (
    <>
      <PageBanner
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Everything you need to know about booking, home service and more."
      />
      <FAQAccordion items={faqs} />
    </>
  );
}
