import { useEffect, useState } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

/**
 * Debounces input changes by 400ms before notifying the parent, so we
 * don't fire a new API request on every keystroke.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  const [term, setTerm] = useState(value || '');

  useEffect(() => {
    setTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (term !== value) onChange(term);
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  return (
    <div className="relative w-full">
      <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-9 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
      />
      {term && (
        <button
          type="button"
          onClick={() => setTerm('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <HiOutlineX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
