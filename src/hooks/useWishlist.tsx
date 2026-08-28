import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import * as customerDataService from '@/services/supabase/customerDataService';
import { useAuth } from '@/hooks/useAuth';

interface WishlistContextValue {
  wishlist: string[];
  toggle: (styleId: string) => void;
  isWishlisted: (styleId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const GUEST_WISHLIST_KEY = 'dhl_guest_wishlist';

// Guests (not signed in, or Supabase not configured) get a wishlist that
// persists to localStorage only — it survives a refresh but isn't tied to
// an account. Once signed in with Supabase configured, it syncs to the
// wishlist_items table instead, scoped to that customer.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isSupabaseConfigured && customer) {
      customerDataService.fetchWishlist(customer.id).then((ids) => ids && setWishlist(ids));
    }
  }, [customer?.id]);

  const toggle = (styleId: string) => {
    const isRemoving = wishlist.includes(styleId);
    setWishlist((prev) => (isRemoving ? prev.filter((id) => id !== styleId) : [...prev, styleId]));

    if (isSupabaseConfigured && customer) {
      if (isRemoving) customerDataService.removeFromWishlistRemote(customer.id, styleId);
      else customerDataService.addToWishlistRemote(customer.id, styleId);
    } else {
      const next = isRemoving ? wishlist.filter((id) => id !== styleId) : [...wishlist, styleId];
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
    }
  };

  const isWishlisted = (styleId: string) => wishlist.includes(styleId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
