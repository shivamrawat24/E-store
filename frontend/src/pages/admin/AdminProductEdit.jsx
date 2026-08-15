import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import ProductForm from '../../components/admin/ProductForm';
import Spinner from '../../components/common/Spinner';
import { fetchProductByIdOrSlug, clearActiveProduct } from '../../redux/slices/productSlice';

const AdminProductEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeProduct, detailStatus, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductByIdOrSlug(id));
    return () => {
      dispatch(clearActiveProduct());
    };
  }, [dispatch, id]);

  if (detailStatus === 'loading' || detailStatus === 'idle') {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (detailStatus === 'failed' || !activeProduct) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-red-500">{error || 'Product not found.'}</p>
        <Link to="/admin/products" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Edit Product</h1>
      <p className="mt-1 text-sm text-gray-500">Editing "{activeProduct.name}"</p>

      <div className="mt-6">
        <ProductForm product={activeProduct} />
      </div>
    </div>
  );
};

export default AdminProductEdit;
