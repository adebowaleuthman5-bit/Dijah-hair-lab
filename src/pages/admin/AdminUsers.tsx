import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmButton from '@/components/admin/ConfirmButton';
import Button from '@/components/ui/Button';
import { useAdminOps } from '@/hooks/useAdminOps';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { roleLabels } from '@/data/admins';
import { formatReadableDate } from '@/utils/format';
import { AdminUser, AdminRole } from '@/types';

const roles: AdminRole[] = ['super-admin', 'manager', 'booking-manager', 'content-manager'];

const emptyForm: AdminUser = { id: '', name: '', email: '', role: 'content-manager', active: true };

export default function AdminUsers() {
  const { adminUsers, addAdminUser, updateAdminUser, removeAdminUser } = useAdminOps();
  const { admin: currentAdmin } = useAdminAuth();
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);

  const isSuperAdmin = currentAdmin?.role === 'super-admin';

  const openNew = () => {
    setEditing({ ...emptyForm, id: `adm-${Date.now()}` });
    setOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    const exists = adminUsers.some((u) => u.id === editing.id);
    if (exists) updateAdminUser(editing.id, editing);
    else addAdminUser(editing);
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Admin Users</h1>
          <p className="mt-1 text-sm text-ink-500">
            {isSuperAdmin ? 'Manage dashboard access and roles.' : 'Only Super Admins can add or remove admin users.'}
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openNew} icon={<Plus size={16} />}>
            Add Admin User
          </Button>
        )}
      </div>

      <AdminTable columns={['Name', 'Email', 'Role', 'Last Login', 'Status', isSuperAdmin ? '' : '']} isEmpty={adminUsers.length === 0}>
        {adminUsers.map((u) => (
          <tr key={u.id} className="hover:bg-cream-100/50">
            <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
            <td className="px-4 py-3 text-ink-700">{u.email}</td>
            <td className="px-4 py-3 text-ink-700">{roleLabels[u.role]}</td>
            <td className="px-4 py-3 text-ink-700">{u.lastLogin ? formatReadableDate(u.lastLogin.slice(0, 10)) : 'Never'}</td>
            <td className="px-4 py-3">
              <button
                disabled={!isSuperAdmin}
                onClick={() => updateAdminUser(u.id, { active: !u.active })}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase disabled:cursor-not-allowed ${
                  u.active ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'
                }`}
              >
                {u.active ? 'Active' : 'Deactivated'}
              </button>
            </td>
            <td className="px-4 py-3 text-right">
              {isSuperAdmin && (
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditing(u);
                      setOpen(true);
                    }}
                    className="text-xs font-semibold uppercase text-ink-700 hover:text-rose-600"
                  >
                    Edit
                  </button>
                  <ConfirmButton label="Remove" onConfirm={() => removeAdminUser(u.id)} />
                </div>
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.name ? 'Edit Admin User' : 'Add Admin User'}>
        {editing && (
          <div className="flex flex-col gap-4">
            <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Role</label>
              <select
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value as AdminRole })}
                className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Admin User
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
      />
    </div>
  );
}
