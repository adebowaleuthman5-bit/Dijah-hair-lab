import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export default function AdminTable({
  columns,
  children,
  isEmpty,
  emptyLabel = 'Nothing to show yet.',
}: {
  columns: string[];
  children: ReactNode;
  isEmpty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-cream-100">
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/5">{children}</tbody>
      </table>
      {isEmpty && (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-ink-500">
          <Inbox size={24} />
          <p className="text-sm">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
