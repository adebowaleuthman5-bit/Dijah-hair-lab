import { Customer, SavedAddress } from '@/types';

// Demo customer used for the account experience. In production this is
// replaced by whatever the auth provider returns after login/register —
// nothing else in the customer account UI should need to change shape.
export const demoCustomer: Customer = {
  id: 'cust-demo-1',
  fullName: 'Amara Okafor',
  email: 'amara@example.com',
  phone: '08012345678',
  registeredAt: '2026-03-14',
};

export const demoAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullAddress: '12 Freedom Way',
    area: 'Lekki Phase 1, Lagos',
    landmark: 'Near Lekki Toll Gate',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullAddress: '4 Admiralty Road',
    area: 'Lekki Phase 1, Lagos',
    isDefault: false,
  },
];
