import { Bell, Calendar, Sparkles, Info } from 'lucide-react';
import { useCustomerData } from '@/hooks/useCustomerData';
import { NotificationType } from '@/types';
import { formatReadableDate } from '@/utils/format';

const iconMap: Record<NotificationType, typeof Bell> = {
  booking: Calendar,
  promo: Sparkles,
  system: Info,
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useCustomerData();
  const sorted = [...notifications].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold uppercase tracking-wide text-rose-600"
          >
            Mark All Read
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-3 rounded-sm border p-4 text-left transition-colors ${
                  n.read ? 'border-ink/10' : 'border-gold-300 bg-gold-50/50'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-rose-600" />}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-500/70">{formatReadableDate(n.date)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
