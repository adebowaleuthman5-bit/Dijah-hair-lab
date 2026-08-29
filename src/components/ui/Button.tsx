import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-cream hover:bg-ink-700 focus-visible:outline-gold-500',
  secondary:
    'bg-gold-500 text-ink hover:bg-gold-600',
  outline:
    'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-cream',
  ghost: 'text-ink hover:bg-ink/5',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1EBE5A]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider transition-colors duration-200 rounded-sm disabled:opacity-50 disabled:pointer-events-none';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

interface ButtonAsButton extends CommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  to?: undefined;
}

interface ButtonAsAnchor extends CommonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  to?: undefined;
}

interface ButtonAsLink extends CommonProps {
  to: string;
  href?: undefined;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children, icon, className = '' } = props;
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={(props as ButtonAsLink).onClick}>
        {icon}
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, target, rel, ...rest } = props as ButtonAsAnchor;
    return (
      <a href={href} target={target} rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)} className={classes} {...(rest as any)}>
        {icon}
        {children}
      </a>
    );
  }

  const { onClick, type, disabled } = props as ButtonAsButton;
  return (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
}
