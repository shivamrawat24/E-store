import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineTag } from 'react-icons/hi';
import { fetchBrands, deleteBrand } from '../../redux/slices/brandSlice';
import BrandForm from '../../components/admin/BrandForm';
import BrandTable from '../../components/admin/BrandTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/shop/SearchBar';
import Spinner from '../../components/common/Spinner';

const AdminBrands = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.brands);
  const [editingBrand, setEditingBrand] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchBrands(true)); // true = include inactive (admin view)
  }, [dispatch]);

  // Brand list endpoint has no server-side search param (unlike products),
  // so we filter the already-fetched list client-side.
  const filteredBrands = useMemo(() => {
    if (!search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter((b) => b.name.toLowerCase().includes(term));
  }, [items, search]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const result = await dispatch(deleteBrand(pendingDelete._id));
    setIsDeleting(false);
    setPendingDelete(null);
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Brand deleted.');
    } else {
      toast.error(result.payload || 'Failed to delete brand.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Brands</h1>
      <p className="mt-1 text-sm text-gray-500">Manage the brands available across your catalog.</p>

      <div className="mt-6">
        <BrandForm brand={editingBrand} onDone={() => setEditingBrand(null)} />
      </div>

      <div className="mt-8 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search brands..." />
      </div>

      <div className="mt-4">
        {status === 'loading' ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <EmptyState
            icon={HiOutlineTag}
            title={search ? 'No brands match your search' : 'No brands yet'}
            description={search ? 'Try a different search term.' : 'Add your first brand using the form above.'}
          />
        ) : (
          <BrandTable brands={filteredBrands} onEdit={setEditingBrand} onDelete={setPendingDelete} />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this brand?"
        description={`"${pendingDelete?.name}" will be permanently removed. Products using it must be reassigned first.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminBrands;
