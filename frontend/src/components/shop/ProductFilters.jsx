const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratingsAverage', label: 'Top Rated' },
  { value: 'name', label: 'Name: A-Z' },
];

const priceRanges = [
  { label: 'Under ₹500', gte: 0, lte: 500 },
  { label: '₹500 - ₹1,000', gte: 500, lte: 1000 },
  { label: '₹1,000 - ₹5,000', gte: 1000, lte: 5000 },
  { label: 'Above ₹5,000', gte: 5000, lte: undefined },
];

/**
 * Controlled filter panel. `filters` mirrors the query params sent to the
 * products API: { category, sort, priceGte, priceLte }.
 */
const ProductFilters = ({ categories, filters, onChange, onReset, className = '' }) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Sort By</h3>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onChange({ ...filters, category: undefined })}
              className="h-4 w-4 accent-brand-600"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat._id}
                onChange={() => onChange({ ...filters, category: cat._id })}
                className="h-4 w-4 accent-brand-600"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Price Range</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name="price"
              checked={!filters.priceGte && !filters.priceLte}
              onChange={() => onChange({ ...filters, priceGte: undefined, priceLte: undefined })}
              className="h-4 w-4 accent-brand-600"
            />
            Any Price
          </label>
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="radio"
                name="price"
                checked={filters.priceGte === range.gte && filters.priceLte === range.lte}
                onChange={() => onChange({ ...filters, priceGte: range.gte, priceLte: range.lte })}
                className="h-4 w-4 accent-brand-600"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Reset Filters
      </button>
    </aside>
  );
};

export default ProductFilters;
