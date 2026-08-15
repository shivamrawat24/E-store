import ProductForm from '../../components/admin/ProductForm';

const AdminProductAdd = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Add Product</h1>
      <p className="mt-1 text-sm text-gray-500">Fill in the details below to add a new product to your catalog.</p>

      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
};

export default AdminProductAdd;
