import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { createCategory, updateCategory } from '../../redux/slices/categorySlice';

/**
 * Slide-down form for creating or editing a category. Pass `category` to
 * edit an existing document, or omit it to create a new one.
 */
const CategoryForm = ({ category, onDone }) => {
  const isEditMode = Boolean(category);
  const dispatch = useDispatch();
  const { mutationStatus } = useSelector((state) => state.categories);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(category?.image?.url || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      isActive: category?.isActive ?? true,
    },
  });

  useEffect(() => {
    reset({
      name: category?.name || '',
      description: category?.description || '',
      isActive: category?.isActive ?? true,
    });
    setPreview(category?.image?.url || '');
    setImageFile(null);
  }, [category, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (formData) => {
    const action = isEditMode
      ? updateCategory({ id: category._id, payload: formData, imageFile })
      : createCategory({ payload: formData, imageFile });

    const result = await dispatch(action);
    if (result.type.endsWith('/fulfilled')) {
      toast.success(isEditMode ? 'Category updated.' : 'Category created.');
      onDone?.();
    } else {
      toast.error(result.payload || 'Something went wrong.');
    }
  };

  const isLoading = mutationStatus === 'loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6" noValidate>
      <h3 className="text-sm font-semibold text-ink-900">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          id="name"
          label="Category Name"
          error={errors.name}
          registration={register('name', { required: 'Name is required', maxLength: { value: 80, message: 'Max 80 characters' } })}
        />
        <div>
          <label htmlFor="categoryImage" className="mb-1.5 block text-sm font-medium text-ink-700">
            Image (optional)
          </label>
          <input
            id="categoryImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          {preview && <img src={preview} alt="Preview" className="mt-2 h-16 w-16 rounded-lg object-cover" />}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            {...register('description', { maxLength: { value: 500, message: 'Max 500 characters' } })}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" className="h-4 w-4 accent-brand-600" {...register('isActive')} />
        Active (visible to customers)
      </label>

      <div className="flex justify-end gap-3">
        {isEditMode && (
          <Button type="button" variant="secondary" onClick={onDone}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Save Changes' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
