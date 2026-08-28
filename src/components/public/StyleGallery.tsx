import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import StyleGalleryCard from '@/components/public/StyleGalleryCard';
import { styles } from '@/data/styles';

export default function StyleGallery() {
  const preview = styles.slice(0, 8);

  return (
    <section className="container-lab py-20 lg:py-28">
      <SectionHeading eyebrow="The Gallery" title="Editorial Style Gallery" align="left" />

      <div className="masonry mt-12">
        {preview.map((style) => (
          <StyleGalleryCard key={style.id} style={style} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button to="/styles" variant="outline">
          View Full Gallery
        </Button>
      </div>
    </section>
  );
}
