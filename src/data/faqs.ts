import { FAQItem } from '@/types';

// Shared by the public /faq page and (later) /admin/faqs — one source
// of truth, edited in one place.
export const faqs: FAQItem[] = [
  {
    id: 'faq-appointment',
    question: 'Do I need an appointment?',
    answer:
      'Yes — we recommend booking ahead through our online booking page or WhatsApp so we can reserve the right amount of time for your style.',
    order: 1,
    published: true,
  },
  {
    id: 'faq-home-service',
    question: 'Do you offer home service?',
    answer:
      'Yes, home service is available across Lagos. Select "Home Service" during booking and provide your address, area and any landmark.',
    order: 2,
    published: true,
  },
  {
    id: 'faq-location',
    question: 'Where are you located?',
    answer: 'We are based in Agungi, Ajah, Lagos State, Nigeria.',
    order: 3,
    published: true,
  },
  {
    id: 'faq-how-to-book',
    question: 'How do I book a hairstyle?',
    answer:
      'Use the "Book Now" button to go through our step-by-step booking flow, or message us directly on WhatsApp.',
    order: 4,
    published: true,
  },
  {
    id: 'faq-choose-style',
    question: 'Can I choose my preferred hairstyle?',
    answer:
      'Absolutely. Browse our style gallery, pick a look, and it will be pre-selected when you start your booking. You can also bring a reference image.',
    order: 5,
    published: true,
  },
  {
    id: 'faq-reschedule',
    question: 'Can I reschedule my appointment?',
    answer:
      'Yes, reschedule requests can be made from your account or by contacting us directly on WhatsApp as early as possible.',
    order: 6,
    published: true,
  },
  {
    id: 'faq-duration',
    question: 'How long does a hairstyle take?',
    answer:
      'Duration varies by style — most estimated times are shown on the service and style pages, and confirmed when you book.',
    order: 7,
    published: true,
  },
  {
    id: 'faq-gender',
    question: 'Do you style both men and women?',
    answer: 'Yes, we offer luxury styling for both men and women.',
    order: 8,
    published: true,
  },
  {
    id: 'faq-contact',
    question: 'How do I contact you?',
    answer: 'The fastest way is WhatsApp at 07036518121, or through our contact form.',
    order: 9,
    published: true,
  },
  {
    id: 'faq-payment',
    question: 'What payment methods are available?',
    answer:
      'Payment details are confirmed with you directly when your booking is reviewed — reach out on WhatsApp for current options.',
    order: 10,
    published: true,
  },
];

// See src/data/services.ts's replaceServices() for why an in-place
// mutation (not reassignment) is what makes this visible to every importer.
export function replaceFaqs(live: FAQItem[]) {
  faqs.length = 0;
  faqs.push(...live);
}
