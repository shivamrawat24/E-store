import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const BrandTable = ({ brands, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Brand</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brands.map((brand) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {brand.logo?.url && <img src={brand.logo.url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium text-ink-900">{brand.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{brand.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      brand.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(brand)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                      aria-label="Edit brand"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(brand)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete brand"
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

export default BrandTable;
