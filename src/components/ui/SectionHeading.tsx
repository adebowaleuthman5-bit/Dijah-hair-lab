interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, description, align = 'left' }: Props) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="max-w-2xl text-3xl font-medium leading-[1.1] text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <span className="rule" />
      {description && <p className="max-w-xl text-base text-ink-500">{description}</p>}
    </div>
  );
}
