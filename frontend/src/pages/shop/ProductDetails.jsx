import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineShoppingCart, HiOutlineArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { fetchProductByIdOrSlug, clearActiveProduct } from '../../redux/slices/productSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import useCart from '../../hooks/useCart';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { activeProduct: product, detailStatus, error } = useSelector((state) => state.products);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductByIdOrSlug(slug));
    setActiveImage(0);
    setQuantity(1);
    return () => {
      dispatch(clearActiveProduct());
    };
  }, [dispatch, slug]);

  const { add } = useCart();

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (detailStatus === 'failed' || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Product not found"
          description={error || "This product may have been removed or is no longer available."}
          action={
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
            {product.images?.[activeImage]?.url ? (
              <img src={product.images[activeImage].url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">No image available</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    idx === activeImage ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category?.name && (
            <Link to={`/category/${product.category.slug}`} className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-ink-900">{formatCurrency(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-base text-gray-400 line-through">{formatCurrency(product.comparePrice)}</span>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">-{discount}%</span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <HiCheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">In Stock</span>
                {product.stock <= (product.lowStockThreshold ?? 5) && (
                  <span className="text-gray-400">— only {product.stock} left</span>
                )}
              </>
            ) : (
              <span className="font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          {product.shortDescription && <p className="mt-4 text-sm text-gray-600">{product.shortDescription}</p>}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2.5 text-lg font-medium text-gray-500 hover:text-ink-900"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3.5 py-2.5 text-lg font-medium text-gray-500 hover:text-ink-900"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button
              disabled={product.status !== 'active' || product.stock === 0}
              className="flex-1"
              onClick={() => add(product, quantity)}
            >
              <HiOutlineShoppingCart className="h-4.5 w-4.5" />
              {product.status !== 'active' ? 'Unavailable' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-ink-900">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{product.description}</p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 text-sm">
            <div>
              <dt className="text-gray-400">SKU</dt>
              <dd className="font-medium text-ink-900">{product.sku}</dd>
            </div>
            {product.brand?.name && (
              <div>
                <dt className="text-gray-400">Brand</dt>
                <dd className="font-medium text-ink-900">{product.brand.name}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
