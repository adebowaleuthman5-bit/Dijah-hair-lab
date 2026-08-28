import { ArrowUp, ArrowDown } from 'lucide-react';
import { useAdminCatalog } from '@/hooks/useAdminCatalog';

export default function AdminCategories() {
  const { categories, updateCategory, reorderCategories } = useAdminCatalog();
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const move = (id: string, direction: -1 | 1) => {
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    reorderCategories(reordered.map((c) => c.id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Categories</h1>
        <p className="mt-1 text-sm text-ink-500">
          Control how each style collection is labeled, described and ordered on the public site.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((cat, idx) => (
          <div key={cat.id} className="flex items-center gap-4 rounded-sm border border-ink/10 bg-white p-4">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => move(cat.id, -1)}
                disabled={idx === 0}
                className="text-ink-500 hover:text-rose-600 disabled:opacity-20"
                aria-label="Move up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => move(cat.id, 1)}
                disabled={idx === sorted.length - 1}
                className="text-ink-500 hover:text-rose-600 disabled:opacity-20"
                aria-label="Move down"
              >
                <ArrowDown size={14} />
              </button>
            </div>

            <img src={cat.image} alt="" className="h-14 w-14 shrink-0 rounded-sm object-cover" />

            <div className="min-w-0 flex-1">
              <input
                value={cat.label}
                onChange={(e) => updateCategory(cat.id, { label: e.target.value })}
                className="w-full border-none bg-transparent p-0 font-display text-base font-medium text-ink focus:outline-none"
              />
              <input
                value={cat.description}
                onChange={(e) => updateCategory(cat.id, { description: e.target.value })}
                className="w-full border-none bg-transparent p-0 text-xs text-ink-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => updateCategory(cat.id, { active: !cat.active })}
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
                cat.active ? 'bg-green-50 text-green-700' : 'bg-ink/10 text-ink-500'
              }`}
            >
              {cat.active ? 'Active' : 'Hidden'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-500">
        Categories map to the fixed service types services and styles already use, so labels and
        visibility can be customized here without breaking existing catalogue links.
      </p>
    </div>
  );
}
