import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'default' | 'gold' | 'rose' | 'violet';
  hint?: string;
}

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  default: 'bg-ink/5 text-ink',
  gold: 'bg-gold-50 text-gold-700',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-100 text-violet-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'default', hint }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneClasses[tone]}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="font-display text-3xl font-medium text-ink">{value}</p>
      {hint && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
