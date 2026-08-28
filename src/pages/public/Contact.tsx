import PageBanner from '@/components/public/PageBanner';
import ContactSection from '@/components/public/ContactSection';

export default function Contact() {
  return (
    <>
      <PageBanner
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Questions, custom requests, or just want to say hi? We'd love to hear from you."
      />
      <ContactSection />
    </>
  );
}
