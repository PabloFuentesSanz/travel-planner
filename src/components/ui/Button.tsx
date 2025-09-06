import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    children, 
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variantClasses = {
      primary: 'bg-[rgb(var(--coral))] text-white hover:bg-[rgb(var(--coral-dark))] focus:ring-[rgb(var(--coral))]',
      secondary: 'bg-[rgb(var(--gray-100))] text-[rgb(var(--black))] hover:bg-[rgb(var(--gray-200))] focus:ring-[rgb(var(--gray-300))]',
      outline: 'border border-[rgb(var(--coral))] text-[rgb(var(--coral))] hover:bg-[rgb(var(--coral))] hover:text-white focus:ring-[rgb(var(--coral))]',
      ghost: 'text-[rgb(var(--coral))] hover:bg-[rgb(var(--coral))]/10 focus:ring-[rgb(var(--coral))]'
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;