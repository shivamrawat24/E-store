import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineTag } from 'react-icons/hi';
import { fetchCategories, deleteCategory } from '../../redux/slices/categorySlice';
import CategoryForm from '../../components/admin/CategoryForm';
import CategoryTable from '../../components/admin/CategoryTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.categories);
  const [editingCategory, setEditingCategory] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories(true)); // true = include inactive (admin view)
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const result = await dispatch(deleteCategory(pendingDelete._id));
    setIsDeleting(false);
    setPendingDelete(null);
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Category deleted.');
    } else {
      toast.error(result.payload || 'Failed to delete category.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Categories</h1>
      <p className="mt-1 text-sm text-gray-500">Organize your catalog into browsable categories.</p>

      <div className="mt-6">
        <CategoryForm category={editingCategory} onDone={() => setEditingCategory(null)} />
      </div>

      <div className="mt-8">
        {status === 'loading' ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={HiOutlineTag} title="No categories yet" description="Add your first category using the form above." />
        ) : (
          <CategoryTable categories={items} onEdit={setEditingCategory} onDelete={setPendingDelete} />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        description={`"${pendingDelete?.name}" will be permanently removed. Products using it must be reassigned first.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminCategories;
