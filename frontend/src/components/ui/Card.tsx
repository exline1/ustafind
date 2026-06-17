import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, hover = true, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-100 ${paddingClasses[padding]} ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
