import { useState } from 'react';

export default function ConfirmButton({
  label,
  confirmLabel = 'Confirm?',
  onConfirm,
  className = 'text-rose-600 hover:text-rose-700',
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <button
        onClick={() => {
          onConfirm();
          setArmed(false);
        }}
        onBlur={() => setArmed(false)}
        className="text-xs font-semibold uppercase tracking-wide text-rose-600 underline"
      >
        {confirmLabel}
      </button>
    );
  }

  return (
    <button onClick={() => setArmed(true)} className={`text-xs font-semibold uppercase tracking-wide ${className}`}>
      {label}
    </button>
  );
}
