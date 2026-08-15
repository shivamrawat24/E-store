import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineCash, HiOutlineSupport } from 'react-icons/hi';

const trustItems = [
  { icon: HiOutlineShieldCheck, title: 'Quality Checked', description: 'Every product is selected for quality and everyday usefulness.' },
  { icon: HiOutlineCash, title: 'Great Value', description: 'Thoughtful pricing with transparent, no-surprise totals.' },
  { icon: HiOutlineTruck, title: 'Fast Delivery', description: 'Quick fulfillment and reliable delivery from order through arrival.' },
  { icon: HiOutlineSupport, title: 'Easy Support', description: 'Helpful support whenever you need guidance before or after purchase.' },
];

const TrustBar = () => {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {trustItems.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
