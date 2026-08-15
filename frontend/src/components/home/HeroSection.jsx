import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi';
import Button from '../common/Button';

const trustPills = [
  { icon: HiOutlineShieldCheck, label: 'Secure checkout' },
  { icon: HiOutlineTruck, label: 'Fast delivery' },
  { icon: HiOutlineSparkles, label: 'Curated picks' },
];

const HeroSection = ({ products = [] }) => {
  const heroProducts = products.slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
      <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_60px_-35px_rgba(17,24,39,0.35)]">
        <div className="grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              <HiOutlineCheckCircle className="h-3.5 w-3.5" />
              Thoughtfully curated essentials
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Better products.
              <span className="block text-brand-600">Better value.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-gray-600 lg:mx-0 lg:text-lg">
              Discover everyday essentials, elevated finds, and customer-loved pieces designed to fit beautifully into modern life.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/shop">
                <Button className="px-7 py-3 text-base">Shop Now</Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="px-7 py-3 text-base">
                  Explore Collection
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {trustPills.map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  <Icon className="h-4 w-4 text-brand-600" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-gray-50 p-4 shadow-inner">
              <div className="grid gap-4 sm:grid-cols-2">
                {heroProducts.length > 0 ? (
                  heroProducts.map((product) => (
                    <div key={product._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0]?.url || 'https://placehold.co/600x800?text=Product'}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-3.5">
                        <p className="truncate text-sm font-semibold text-ink-900">{product.name}</p>
                        <p className="mt-1 text-sm font-medium text-brand-600">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(product.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="h-64 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50" />
                    <div className="h-64 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />
                  </>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">This week</p>
                    <p className="mt-1 text-xl font-bold text-ink-900">Fresh arrivals</p>
                  </div>
                  <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                    Shop the latest
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
