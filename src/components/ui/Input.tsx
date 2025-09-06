import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, className = '', ...props },
    ref
  ) => {
    const hasError = Boolean(error);

    const inputClasses = `
      w-full px-4 py-2.5 text-[rgb(var(--black))] bg-white border rounded-lg 
      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
      ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-[rgb(var(--gray-300))] focus:border-[rgb(var(--coral))] focus:ring-[rgb(var(--coral))]/20'
      }
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      placeholder:text-[rgb(var(--gray-300))]
      disabled:bg-[rgb(var(--gray-50))] disabled:cursor-not-allowed
      ${className}
    `.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[rgb(var(--black))]">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--gray-300))]">
              {leftIcon}
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--gray-300))]">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`text-sm ${
              error ? 'text-red-600' : 'text-[rgb(var(--gray-300))]'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
