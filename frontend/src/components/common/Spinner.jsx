const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/**
 * Simple animated spinner. `light` variant is used on dark/brand buttons.
 */
const Spinner = ({ size = 'md', light = false, className = '' }) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-solid ${sizeMap[size]} ${
        light ? 'border-white/30 border-t-white' : 'border-gray-200 border-t-brand-600'
      } ${className}`}
    />
  );
};

export default Spinner;
