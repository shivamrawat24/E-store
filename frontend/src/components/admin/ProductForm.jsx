import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import ImageDropzone from './ImageDropzone';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';

/**
 * Shared form for both "Add Product" and "Edit Product" admin pages.
 * Pass `product` (the existing document) when editing; omit it to create.
 */
const ProductForm = ({ product }) => {
  const isEditMode = Boolean(product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, status: categoryStatus } = useSelector((state) => state.categories);
  const { mutationStatus } = useSelector((state) => state.products);

  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [imageError, setImageError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      price: product?.price ?? '',
      comparePrice: product?.comparePrice ?? '',
      sku: product?.sku || '',
      category: product?.category?._id || '',
      stock: product?.stock ?? '',
      lowStockThreshold: product?.lowStockThreshold ?? 5,
      tags: product?.tags?.join(', ') || '',
      status: product?.status || 'draft',
      isFeatured: product?.isFeatured || false,
      isBestSeller: product?.isBestSeller || false,
    },
  });

  useEffect(() => {
    if (categoryStatus === 'idle') dispatch(fetchCategories());
  }, [categoryStatus, dispatch]);

  const handleAddFiles = (files) => setNewFiles((prev) => [...prev, ...files]);
  const handleRemoveNewFile = (idx) => setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  const handleRemoveExisting = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemovedImageIds((prev) => [...prev, publicId]);
  };

  const onSubmit = async (formData) => {
    if (existingImages.length + newFiles.length === 0) {
      setImageError('At least one product image is required.');
      return;
    }
    setImageError('');

    const payload = {
      ...formData,
      comparePrice: formData.comparePrice || undefined,
    };

    const action = isEditMode
      ? updateProduct({ id: product._id, payload, imageFiles: newFiles, removedImageIds })
      : createProduct({ payload, imageFiles: newFiles });

    const result = await dispatch(action);
    if (result.type.endsWith('/fulfilled')) {
      toast.success(isEditMode ? 'Product updated successfully.' : 'Product created successfully.');
      navigate('/admin/products');
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  const isLoading = mutationStatus === 'loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-5 text-sm font-semibold text-ink-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormInput
              id="name"
              label="Product Name"
              error={errors.name}
              registration={register('name', { required: 'Product name is required', maxLength: { value: 140, message: 'Max 140 characters' } })}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-700">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 ${
                errors.description ? 'border-red-400' : 'border-gray-300 focus:border-brand-500'
              }`}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.description.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <FormInput
              id="shortDescription"
              label="Short Description (optional)"
              error={errors.shortDescription}
              registration={register('shortDescription', { maxLength: { value: 200, message: 'Max 200 characters' } })}
            />
          </div>
          <FormInput
            id="sku"
            label="SKU"
            error={errors.sku}
            registration={register('sku', { required: 'SKU is required' })}
          />
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink-700">
              Category
            </label>
            <select
              id="category"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/40 ${
                errors.category ? 'border-red-400' : 'border-gray-300 focus:border-brand-500'
              }`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.category.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-5 text-sm font-semibold text-ink-900">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormInput
            id="price"
            label="Selling Price (₹)"
            type="number"
            step="0.01"
            error={errors.price}
            registration={register('price', { required: 'Price is required', min: { value: 0, message: 'Must be positive' } })}
          />
          <FormInput
            id="comparePrice"
            label="Compare-at Price (₹)"
            type="number"
            step="0.01"
            error={errors.comparePrice}
            registration={register('comparePrice', { min: { value: 0, message: 'Must be positive' } })}
          />
          <FormInput
            id="stock"
            label="Stock Quantity"
            type="number"
            error={errors.stock}
            registration={register('stock', { required: 'Stock is required', min: { value: 0, message: 'Must be non-negative' } })}
          />
          <FormInput
            id="lowStockThreshold"
            label="Low Stock Threshold"
            type="number"
            error={errors.lowStockThreshold}
            registration={register('lowStockThreshold', { min: { value: 0, message: 'Must be non-negative' } })}
          />
          <FormInput id="tags" label="Tags (comma-separated)" registration={register('tags')} />
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink-700">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
              {...register('status')}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" {...register('isFeatured')} />
            Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" {...register('isBestSeller')} />
            Best Seller
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-5 text-sm font-semibold text-ink-900">Product Images</h3>
        <ImageDropzone
          existingImages={existingImages}
          newFiles={newFiles}
          onAddFiles={handleAddFiles}
          onRemoveExisting={handleRemoveExisting}
          onRemoveNewFile={handleRemoveNewFile}
          error={imageError}
        />
      </section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
