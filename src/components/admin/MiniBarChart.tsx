interface BarDatum {
  label: string;
  value: number;
}

export default function MiniBarChart({ data, tone = 'gold' }: { data: BarDatum[]; tone?: 'gold' | 'rose' | 'violet' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barColor = { gold: 'bg-gold-500', rose: 'bg-rose-500', violet: 'bg-violet-500' }[tone];

  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end">
            <div
              className={`w-full rounded-t-sm ${barColor} transition-all`}
              style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[10px] font-medium uppercase text-ink-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
