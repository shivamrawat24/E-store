import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

/**
 * Builds a compact page list with ellipses, e.g. 1 ... 4 5 [6] 7 8 ... 20
 */
const buildPageList = (current, total) => {
  const pages = [];
  const delta = 1;
  const range = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i += 1) {
    range.push(i);
  }

  pages.push(1);
  if (range[0] > 2) pages.push('...');
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push('...');
  if (total > 1) pages.push(total);

  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = buildPageList(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-ink-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <HiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1.5 text-sm text-gray-400">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === page ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-ink-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <HiChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
