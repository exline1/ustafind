import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-dark mb-1.5">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border-[1.5px] border-gray-light bg-white text-gray-900 placeholder-gray-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light/40 transition-all duration-300 ease-in-out resize-y min-h-[100px] ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
