import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { businessSettings } from '@/data/business';

export default function WhatsAppFloatButton() {
  return (
    <a
      href={buildWhatsAppLink(`Hi ${businessSettings.businessName}, I'd like to know more about your services.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105 sm:bottom-8 sm:right-8"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}
