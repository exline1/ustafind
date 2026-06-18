import { type InputHTMLAttributes, useState, forwardRef } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-dark mb-1.5">{label}</label>
        )}
        <div className="relative group">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-muted group-focus-within:text-brand transition-colors duration-300">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`w-full px-4 py-3 min-h-[44px] rounded-lg border-[1.5px] border-gray-light bg-white text-gray-900 placeholder-gray-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light/40 transition-all duration-300 ease-in-out ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted hover:text-brand transition-colors duration-300"
              aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
            >
              {showPassword ? (
                <EyeSlash className="w-5 h-5" weight="regular" />
              ) : (
                <Eye className="w-5 h-5" weight="regular" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
