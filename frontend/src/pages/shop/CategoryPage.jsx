import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineCube, HiOutlineArrowLeft } from 'react-icons/hi';
import axiosInstance from '../../api/axiosInstance';
import productApi from '../../api/productApi';
import ProductCard from '../../components/shop/ProductCard';
import ProductGridSkeleton from '../../components/skeletons/ProductGridSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/shop/Pagination';
import Spinner from '../../components/common/Spinner';

const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

/**
 * Resolves the category by its slug first (so we know its display name and
 * Mongo _id), then fetches the paginated product list filtered to that
 * category. Kept separate from Shop.jsx since the "category identity"
 * lookup step is unique to this route.
 */
const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalResults: 0 });
  const [status, setStatus] = useState('loading'); // loading | succeeded | failed

  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus('loading');
      try {
        const { data: categoryRes } = await axiosInstance.get(`/categories/${slug}`);
        if (cancelled) return;
        const cat = categoryRes.data.category;
        setCategory(cat);

        const { data: productsRes } = await productApi.getProducts({
          category: cat._id,
          sort,
          page,
          limit: 12,
        });
        if (cancelled) return;
        setProducts(productsRes.data.products);
        setPagination(productsRes.data.pagination);
        setStatus('succeeded');
      } catch (error) {
        if (!cancelled) setStatus('failed');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, sort, page]);

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', nextPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'loading' && !category) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'failed' && !category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Category not found"
          description="This category may have been removed or renamed."
          action={
            <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Browse all products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/shop" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600">
        <HiOutlineArrowLeft className="h-4 w-4" />
        All Products
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{category?.name}</h1>
          {category?.description && <p className="mt-1 max-w-xl text-sm text-gray-500">{category.description}</p>}
        </div>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 sm:w-56"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {status === 'loading' ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <EmptyState icon={HiOutlineCube} title="No products in this category yet" description="Check back soon." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
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
  );
};

export default CategoryPage;
