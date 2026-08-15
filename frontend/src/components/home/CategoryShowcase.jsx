import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryShowcase = ({ categories = [] }) => {
  const visible = categories.filter((category) => category?.isActive !== false).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Browse</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">Shop by Category</h2>
        </div>
        <Link to="/shop" className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex">
          View all products
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((category, index) => (
          <motion.div
            key={category._id || category.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm"
          >
            <Link to={`/category/${category.slug}`} className="block">
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-brand-50">
                {category.image?.url ? (
                  <img
                    src={category.image.url}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-black text-brand-600/20">
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">Curated collection</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">Explore</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
