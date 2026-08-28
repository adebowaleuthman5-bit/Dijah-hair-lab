import { businessSettings } from '@/data/business';
import { BookingDraft } from '@/types';

// Converts a Nigerian local number like 07036518121 into international
// format (234...) for the wa.me deep link.
function toInternationalNumber(local: string): string {
  const digits = local.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppLink(message?: string): string {
  const number = toInternationalNumber(businessSettings.whatsappNumber);
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildBookingWhatsAppMessage(draft: BookingDraft, serviceName?: string, styleName?: string): string {
  const lines = [
    `Hi ${businessSettings.businessName}, I'd like to book an appointment.`,
    serviceName ? `Service: ${serviceName}` : undefined,
    styleName ? `Style: ${styleName}` : undefined,
    draft.locationType
      ? `Location: ${draft.locationType === 'in-shop' ? 'In-shop' : 'Home service'}`
      : undefined,
    draft.locationType === 'home-service' && draft.homeServiceDetails
      ? `Address: ${draft.homeServiceDetails.fullAddress}, ${draft.homeServiceDetails.area}`
      : undefined,
    draft.date ? `Date: ${draft.date}` : undefined,
    draft.time ? `Time: ${draft.time}` : undefined,
    draft.customer?.fullName ? `Name: ${draft.customer.fullName}` : undefined,
    draft.customer?.phone ? `Phone: ${draft.customer.phone}` : undefined,
  ].filter(Boolean);

  return lines.join('\n');
}
