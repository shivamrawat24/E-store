import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineCube } from 'react-icons/hi';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProductTable from '../../components/admin/ProductTable';
import Pagination from '../../components/shop/Pagination';
import SearchBar from '../../components/shop/SearchBar';
import Spinner from '../../components/common/Spinner';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items, pagination, listStatus } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ search: search || undefined, page, limit: 10 }));
  }, [dispatch, search, page]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const result = await dispatch(deleteProduct(pendingDelete._id));
    setIsDeleting(false);
    setPendingDelete(null);
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Product deleted.');
    } else {
      toast.error(result.payload || 'Failed to delete product.');
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your product catalog.</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <HiOutlinePlus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="mt-6 max-w-sm">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, SKU, or tag..."
        />
      </div>

      <div className="mt-6">
        {listStatus === 'loading' ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={HiOutlineCube}
            title="No products found"
            description="Try adjusting your search, or add your first product."
            action={
              <Link to="/admin/products/new">
                <Button>Add Product</Button>
              </Link>
            }
          />
        ) : (
          <>
            <ProductTable products={items} onDelete={setPendingDelete} />
            <div className="mt-6">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this product?"
        description={`"${pendingDelete?.name}" will be permanently removed, along with its images. This cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminProducts;
