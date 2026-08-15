import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { formatCurrency } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { add } = useCart();

  const primaryImage = product.images?.[0]?.url;

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <Link
        to={`/products/${product.slug}`}
        className="block"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}

          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <span className="absolute right-3 top-3 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-1 p-3.5">
          <p className="truncate text-sm font-medium text-ink-900">
            {product.name}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink-900">
              {formatCurrency(product.price)}
            </span>

            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add To Cart */}
      <div className="px-3.5 pb-3.5">
        <button
          type="button"
          disabled={product.stock === 0}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-2 text-xs font-semibold text-ink-900 transition-colors hover:border-brand-600 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            add(product, 1);
          }}
        >
          <HiOutlineShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;