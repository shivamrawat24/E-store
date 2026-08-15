import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCube, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import ProductCard from '../../components/shop/ProductCard';
import ProductFilters from '../../components/shop/ProductFilters';
import SearchBar from '../../components/shop/SearchBar';
import Pagination from '../../components/shop/Pagination';
import ProductGridSkeleton from '../../components/skeletons/ProductGridSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

/**
 * Reads/writes all listing state (search, category, price range, sort, page)
 * directly to/from the URL query string, so filtered views are shareable
 * and survive a page refresh.
 */
const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { items, pagination, listStatus } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || undefined,
      sort: searchParams.get('sort') || '-createdAt',
      priceGte: searchParams.get('priceGte') ? Number(searchParams.get('priceGte')) : undefined,
      priceLte: searchParams.get('priceLte') ? Number(searchParams.get('priceLte')) : undefined,
    }),
    [searchParams]
  );
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const query = {
      page,
      limit: 12,
      sort: filters.sort,
    };
    if (filters.search) query.search = filters.search;
    if (filters.category) query.category = filters.category;
    if (filters.priceGte !== undefined) query['price[gte]'] = filters.priceGte;
    if (filters.priceLte !== undefined) query['price[lte]'] = filters.priceLte;

    dispatch(fetchProducts(query));
  }, [dispatch, filters, page]);

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.delete('page'); // reset to page 1 whenever filters change
    setSearchParams(params);
  };

  const handleFilterChange = (nextFilters) => {
    updateParams({
      category: nextFilters.category,
      sort: nextFilters.sort,
      priceGte: nextFilters.priceGte,
      priceLte: nextFilters.priceLte,
    });
  };

  const handleSearchChange = (term) => updateParams({ search: term });

  const handleResetFilters = () => setSearchParams({});

  const handlePageChange = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', nextPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Shop All Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.totalResults} product{pagination.totalResults === 1 ? '' : 's'} available
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={filters.search} onChange={handleSearchChange} />
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        {/* Desktop filters */}
        <ProductFilters
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          className="hidden w-56 shrink-0 lg:block"
        />

        <div className="flex-1">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="mb-4 flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-ink-700 lg:hidden"
          >
            <HiOutlineFilter className="h-4 w-4" />
            Filters
          </button>

          {listStatus === 'loading' ? (
            <ProductGridSkeleton count={12} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={HiOutlineCube}
              title="No products found"
              description="Try adjusting your search or filters."
              action={
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-72 flex-col overflow-y-auto bg-white p-5">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mb-4 flex h-8 w-8 items-center justify-center self-end rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Close filters"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
            <ProductFilters
              categories={categories}
              filters={filters}
              onChange={(next) => {
                handleFilterChange(next);
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
