import { Link } from 'react-router-dom';
import Button from '../common/Button';

const PromotionalBanner = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-brand-100 p-8 sm:p-10">
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Fresh picks</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Find something you’ll love.</h2>
            <p className="mt-2 max-w-xl text-base text-gray-600">
              Explore everyday essentials and standout pieces with quality you can feel good about.
            </p>
          </div>

          <Link to="/shop">
            <Button className="px-7 py-3 text-base">Shop Collection</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
