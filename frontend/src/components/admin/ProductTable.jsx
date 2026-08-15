import { Link } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { formatCurrency } from '../../utils/formatCurrency';

const statusStyles = {
  active: 'bg-green-50 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  archived: 'bg-red-50 text-red-600',
};

const ProductTable = ({ products, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Product</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">SKU</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Stock</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {product.images?.[0]?.url && (
                        <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{product.name}</p>
                      <p className="truncate text-xs text-gray-400">{product.category?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                <td className="px-4 py-3 font-medium text-ink-900">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock <= (product.lowStockThreshold ?? 5) ? 'font-semibold text-red-600' : 'text-gray-700'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                      aria-label="Edit product"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete product"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
