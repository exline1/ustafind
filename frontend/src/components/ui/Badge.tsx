interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'category' | 'rating';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  success: 'bg-brand-light text-brand-dark',
  warning: 'bg-rating/15 text-rating',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-brand/10 text-brand-dark',
  neutral: 'bg-gray-light text-gray-muted',
  category: 'bg-gray-light text-gray-muted hover:bg-brand-light hover:text-brand-dark transition-colors duration-300',
  rating: 'bg-rating/10 text-rating',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2.5 py-0.5 text-xs rounded-lg',
  md: 'px-3 py-1 text-sm rounded-lg',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {variant === 'success' && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-dark shrink-0" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
