import { Check } from 'lucide-react';

const stepLabels = ['Service', 'Style', 'Location', 'Date', 'Time', 'Details', 'Summary'];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-1">
      {stepLabels.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <div key={label} className="flex shrink-0 items-center gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  isDone
                    ? 'bg-gold-500 text-ink'
                    : isActive
                      ? 'bg-ink text-cream'
                      : 'bg-ink/10 text-ink-500'
                }`}
              >
                {isDone ? <Check size={13} /> : stepNum}
              </span>
              <span
                className={`whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide ${
                  isActive ? 'text-ink' : 'text-ink-500'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < stepLabels.length - 1 && (
              <span className={`mx-1 h-px w-6 sm:w-10 ${isDone ? 'bg-gold-500' : 'bg-ink/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
