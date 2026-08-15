import Spinner from './Spinner';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-ink-900 focus:ring-gray-400',
  outline: 'border border-gray-300 hover:bg-gray-50 text-ink-900 focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

/**
 * Base button used across the app. Handles loading + disabled states
 * consistently so every form submit button behaves the same way.
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {isLoading && <Spinner size="sm" light={variant === 'primary' || variant === 'danger'} />}
      {children}
    </button>
  );
};

export default Button;
