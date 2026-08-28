import Button from '@/components/ui/Button';

export default function AboutPreview() {
  return (
    <section className="bg-violet-100/40">
      <div className="container-lab grid grid-cols-1 items-center gap-0 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[36rem]">
          <img
            src="https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1200&q=80"
            alt="Stylist at work inside DIJAH HAIR LAB"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 px-6 py-16 sm:px-12 lg:px-16">
          <span className="eyebrow">Our Story</span>
          <h2 className="max-w-lg font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            About DIJAH HAIR LAB
          </h2>
          <span className="rule" />
          <p className="max-w-md text-base leading-relaxed text-ink-500">
            DIJAH HAIR LAB was built on a simple belief: hair should feel as good as it looks. From
            our studio in Agungi, Ajah, we bring together luxury styling, weaving and dreadlocking
            expertise with a warm, personal approach — whether you visit us in-shop or invite us
            into your home.
          </p>
          <div>
            <Button to="/about" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
