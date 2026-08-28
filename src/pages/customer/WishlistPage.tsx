import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { styles } from '@/data/styles';
import StyleGalleryCard from '@/components/public/StyleGalleryCard';
import Button from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const wishlistedStyles = styles.filter((s) => wishlist.includes(s.id));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium text-ink">My Wishlist</h1>

      {wishlistedStyles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-ink/15 py-16 text-center">
          <Heart size={28} className="text-ink/20" />
          <p className="text-sm text-ink-500">You haven&apos;t saved any styles yet.</p>
          <Button to="/styles" size="sm" variant="outline">
            Browse Styles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlistedStyles.map((style) => (
            <StyleGalleryCard key={style.id} style={style} aspect="square" />
          ))}
        </div>
      )}
    </div>
  );
}
