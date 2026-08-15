import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineArrowRight,
  HiOutlineBadgeCheck,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineTruck,
} from 'react-icons/hi';
import { fetchProducts } from '../redux/slices/productSlice';
import Button from '../components/common/Button';
import ProductCard from '../components/shop/ProductCard';

const benefits = [
  {
    icon: HiOutlineBadgeCheck,
    title: 'Quality Products',
    description: 'Carefully selected essentials and standout finds chosen with everyday usefulness in mind.',
  },
  {
    icon: HiOutlineCash,
    title: 'Fair Pricing',
    description: 'Transparent value-focused pricing without unnecessary markups or confusing add-ons.',
  },
  {
    icon: HiOutlineLockClosed,
    title: 'Secure Payments',
    description: 'A safer way to shop, with trusted checkout and secure payment processing built in.',
  },
  {
    icon: HiOutlineTruck,
    title: 'Reliable Shopping',
    description: 'Clear order handling and a smoother shopping experience from cart to doorstep.',
  },
  {
    icon: HiOutlineHeart,
    title: 'Customer First',
    description: 'We focus on making the experience simple, easy, and enjoyable at every step.',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Growing With You',
    description: 'We continue improving the experience as customer needs and product choices evolve.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Browse products that fit your lifestyle and day-to-day needs.',
    icon: HiOutlineSearch,
  },
  {
    number: '02',
    title: 'Choose',
    description: 'Compare details, pricing, and fit before selecting what feels right for you.',
    icon: HiOutlineShoppingBag,
  },
  {
    number: '03',
    title: 'Order',
    description: 'Add to cart and complete a secure, straightforward checkout flow.',
    icon: HiOutlineCheckCircle,
  },
  {
    number: '04',
    title: 'Receive',
    description: 'Track your order and enjoy a reliable delivery experience from start to finish.',
    icon: HiOutlineClock,
  },
];

const principles = [
  'Transparency in pricing and product information',
  'Focused value without compromising on quality',
  'Convenience that keeps shopping simple and stress-free',
  'A customer-first experience designed for everyday life',
];

const About = () => {
  const dispatch = useDispatch();
  const { items: products, listStatus, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8, sort: '-createdAt' }));
  }, [dispatch]);

  const productShowcase = products.slice(0, 6);

  return (
    <div className="bg-[#f9fafb] text-ink-900">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_60px_-35px_rgba(17,24,39,0.35)]">
          <div className="grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Our story</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                More Than Just a Store.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 lg:text-lg">
                We believe shopping should be simple, trustworthy, and worth every rupee — from discovery to delivery.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link to="/shop">
                  <Button className="px-7 py-3 text-base">Shop Now</Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" className="px-7 py-3 text-base">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gradient-to-br from-brand-50 via-white to-gray-100 p-4 shadow-inner">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1].map((index) => (
                    <div key={index} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        {productShowcase[index] ? (
                          <img
                            src={productShowcase[index].images?.[0]?.url || 'https://placehold.co/600x800?text=Product'}
                            alt={productShowcase[index].name || 'Featured product'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50 text-lg font-bold text-brand-600">
                            Curated
                          </div>
                        )}
                      </div>
                      <div className="p-3.5">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {productShowcase[index]?.name || 'Carefully chosen essentials'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white p-3 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="overflow-hidden rounded-[1.25rem] bg-gray-100">
                  {productShowcase[index] ? (
                    <img
                      src={productShowcase[index].images?.[0]?.url || 'https://placehold.co/600x900?text=Product'}
                      alt={productShowcase[index].name || 'Product collection'}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gradient-to-br from-gray-100 to-brand-50 text-sm font-semibold text-gray-500">
                      Product showcase
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Our story</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Built for everyday living.</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We set out to create a simpler way to shop for the things that make daily life easier, more enjoyable, and more comfortable.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              By sourcing products thoughtfully, focusing on quality and value, and creating a platform that feels easy to trust, we aim to help customers find useful items without the hassle usually associated with online shopping.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Our approach is straightforward: make the experience reliable, honest, and customer-first from start to finish.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Why us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">Why Shop With Us?</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-6 transition-transform duration-200 hover:-translate-y-1 hover:bg-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Simple process</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">How It Works</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div key={number} className="relative rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold tracking-[0.2em] text-brand-600">{number}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#eef2f7] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Our commitment</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Built Around Your Shopping Experience</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {principles.map((principle) => (
                  <div key={principle} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-6 text-gray-700">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Discover</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">Something You’ll Love</h2>
          </div>
          <Link to="/shop">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>

        {listStatus === 'loading' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            We’re updating our product selection right now. Please try again in a moment.
          </div>
        ) : productShowcase.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productShowcase.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No products are available right now. Please check back soon.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Ready to shop</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Ready to Find Your Next Favorite Product?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
            Explore our collection and discover products selected with value, quality, and convenience in mind.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/shop">
              <Button className="px-8 py-3 text-base">
                Shop Now
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="px-8 py-3 text-base">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
