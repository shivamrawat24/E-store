import { Link } from 'react-router-dom';
import Button from '../common/Button';

const FinalCTA = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Ready to shop</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">Ready to find your next favorite product?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
          Explore an assortment of everyday essentials and elevated picks chosen to fit real life beautifully.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/shop">
            <Button className="px-8 py-3 text-base">Start Shopping</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="px-8 py-3 text-base">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
