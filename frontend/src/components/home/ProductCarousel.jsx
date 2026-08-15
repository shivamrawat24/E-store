import { useRef } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import ProductCard from '../shop/ProductCard';

const ProductCarousel = ({ title, subtitle, products = [] }) => {
  const scrollRef = useRef(null);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Trending</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll products left"
              onClick={() => scrollByAmount(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-ink-900 transition-colors hover:border-brand-200 hover:text-brand-600"
            >
              <HiOutlineChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll products right"
              onClick={() => scrollByAmount(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-ink-900 transition-colors hover:border-brand-200 hover:text-brand-600"
            >
              <HiOutlineChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div key={product._id} className="min-w-[280px] max-w-[280px] snap-start sm:min-w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
