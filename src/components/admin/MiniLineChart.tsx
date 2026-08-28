interface LineDatum {
  label: string;
  value: number;
}

export default function MiniLineChart({ data, color = '#D9A94E' }: { data: LineDatum[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const height = 100;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data
    .map((d, i) => `${i * step},${height - (d.value / max) * (height - 10) - 5}`)
    .join(' ');

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-32 w-full">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={d.label} cx={i * step} cy={height - (d.value / max) * (height - 10) - 5} r="2" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] font-medium uppercase text-ink-500">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
