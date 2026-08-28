import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4" onClick={onClose}>
      <div
        className={`w-full ${maxWidth} max-h-[88vh] overflow-y-auto rounded-sm bg-white p-6 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl font-medium text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink-500 hover:text-rose-600">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
