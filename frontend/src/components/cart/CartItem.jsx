import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';
import { formatCurrency } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';

const CartItem = ({ item, compact = false }) => {
  const { increase, decrease, remove } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className={`flex gap-3 ${compact ? 'py-3' : 'py-4'}`}>
      <Link
        to={`/products/${item.slug}`}
        className={`shrink-0 overflow-hidden rounded-lg bg-gray-100 ${compact ? 'h-16 w-16' : 'h-24 w-24'}`}
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">No image</div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${item.slug}`}
            className={`line-clamp-2 font-medium text-ink-900 hover:text-brand-600 ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(item.productId)}
            className="shrink-0 text-gray-400 hover:text-red-500"
            aria-label="Remove item"
          >
            <HiOutlineTrash className={compact ? 'h-4 w-4' : 'h-4.5 w-4.5'} />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() => decrease(item.productId)}
              className="px-2 py-1 text-gray-500 hover:text-ink-900"
              aria-label="Decrease quantity"
            >
              <HiOutlineMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-ink-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => increase(item.productId)}
              disabled={item.quantity >= item.stock}
              className="px-2 py-1 text-gray-500 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <HiOutlinePlus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className={`font-semibold text-ink-900 ${compact ? 'text-xs' : 'text-sm'}`}>{formatCurrency(lineTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
