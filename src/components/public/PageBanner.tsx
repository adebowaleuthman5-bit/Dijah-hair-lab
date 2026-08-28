export default function PageBanner({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="border-b border-ink/10 bg-ink-700 py-16 text-cream sm:py-20">
      <div className="container-lab flex flex-col gap-4">
        <span className="eyebrow text-gold-500">{eyebrow}</span>
        <h1 className="max-w-2xl font-display text-4xl font-medium leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="max-w-xl text-sm text-cream/70 sm:text-base">{description}</p>}
      </div>
    </section>
  );
}
