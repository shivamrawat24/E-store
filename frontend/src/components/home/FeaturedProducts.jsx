import { Link } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import Button from '../common/Button';

const FeaturedProducts = ({ title, subtitle, products = [] }) => {
  const visibleProducts = products.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Curated</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        <Link to="/shop">
          <Button variant="outline">View All Products</Button>
        </Link>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Product selections will appear here once inventory is available.
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
