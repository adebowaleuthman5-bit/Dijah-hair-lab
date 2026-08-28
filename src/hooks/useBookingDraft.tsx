import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingDraft } from '@/types';

interface BookingDraftContextValue {
  draft: BookingDraft;
  setDraft: (updater: (prev: BookingDraft) => BookingDraft) => void;
  resetDraft: () => void;
}

const BookingDraftContext = createContext<BookingDraftContextValue | undefined>(undefined);

// Holds the in-progress booking as the customer moves through the 8-step
// flow. Also lets "Book This Style" (style detail page) and "Book Now"
// (service cards) preselect a starting point before the flow even mounts.
export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft>({});

  const setDraft = (updater: (prev: BookingDraft) => BookingDraft) => {
    setDraftState((prev) => updater(prev));
  };

  const resetDraft = () => setDraftState({});

  return (
    <BookingDraftContext.Provider value={{ draft, setDraft, resetDraft }}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error('useBookingDraft must be used within BookingDraftProvider');
  return ctx;
}
