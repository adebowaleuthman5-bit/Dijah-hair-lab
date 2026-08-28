import { AdminUser } from '@/types';

// Demo admin accounts. SUPER ADMIN has full access; other roles are scoped
// per the brief (Manager, Booking Manager, Content Manager) — role-gating
// of specific actions can be layered on top of this list once real auth
// exists. For now /admin/login accepts any of these emails with any
// password (see hooks/useAdminAuth.tsx).
export const adminUsers: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Bolanle Dijah',
    email: 'admin@dijahhairlab.com',
    role: 'super-admin',
    active: true,
    lastLogin: '2026-08-10T09:12:00Z',
  },
  {
    id: 'adm-2',
    name: 'Chidinma Okafor',
    email: 'chidinma@dijahhairlab.com',
    role: 'booking-manager',
    active: true,
    lastLogin: '2026-08-09T14:30:00Z',
  },
  {
    id: 'adm-3',
    name: 'Tola Adeyemi',
    email: 'tola@dijahhairlab.com',
    role: 'content-manager',
    active: true,
    lastLogin: '2026-08-07T11:05:00Z',
  },
  {
    id: 'adm-4',
    name: 'Femi Bakare',
    email: 'femi@dijahhairlab.com',
    role: 'manager',
    active: false,
  },
];

export const roleLabels: Record<AdminUser['role'], string> = {
  'super-admin': 'Super Admin',
  manager: 'Manager',
  'booking-manager': 'Booking Manager',
  'content-manager': 'Content Manager',
};
