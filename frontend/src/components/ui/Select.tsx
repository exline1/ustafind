import { forwardRef, type SelectHTMLAttributes } from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-dark mb-1.5">{label}</label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={`w-full px-4 py-3 min-h-[44px] rounded-lg border-[1.5px] border-gray-light bg-white text-gray-900 appearance-none focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light/40 transition-all duration-300 ease-in-out pr-10 ${error ? 'border-danger' : ''} ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-muted pointer-events-none group-focus-within:text-brand transition-colors duration-300"
            weight="bold"
            aria-hidden="true"
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
