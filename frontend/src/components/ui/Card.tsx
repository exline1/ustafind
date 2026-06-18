import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  hover = true,
  padding = 'md',
  glass = true,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl ${glass ? 'glass-card' : 'bg-white shadow-md border border-gray-light'} ${paddingClasses[padding]} ${
        hover
          ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
