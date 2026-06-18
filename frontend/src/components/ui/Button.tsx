import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { CircleNotch } from '@phosphor-icons/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-brand text-white shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.97] uppercase tracking-wide',
  secondary: 'bg-gray-light text-brand-dark hover:bg-gray-light/80',
  outline:
    'border-[1.5px] border-brand-dark text-brand-dark bg-transparent hover:bg-brand-light/10 active:scale-[0.97]',
  ghost:
    'text-brand bg-transparent hover:underline underline-offset-4 decoration-brand active:scale-[0.97]',
  danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm active:scale-[0.97]',
  white:
    'bg-white text-brand-dark border border-white/80 hover:bg-white/90 shadow-md active:scale-[0.97] uppercase tracking-wide',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2.5 text-xs min-h-[44px]',
  md: 'px-7 py-3.5 text-sm min-h-[44px]',
  lg: 'px-7 py-[14px] text-sm min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <CircleNotch className="w-4 h-4 animate-spin" weight="bold" aria-hidden="true" />
      ) : icon ? (
        <span className="w-4 h-4 shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
