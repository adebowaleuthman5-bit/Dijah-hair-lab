import { getFullAddress } from '@/data/business';

export function buildDirectionsLink(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getFullAddress())}`;
}

export function buildMapsEmbedSrc(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(getFullAddress())}&output=embed`;
}
