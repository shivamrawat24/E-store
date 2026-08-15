import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineCreditCard, HiOutlineGift } from 'react-icons/hi';

const steps = [
  { number: '01', title: 'Discover', description: 'Browse thoughtfully selected products with clear details and standout essentials.', icon: HiOutlineSearch },
  { number: '02', title: 'Choose', description: 'Add the pieces you love to your cart and refine quantities with ease.', icon: HiOutlineShoppingCart },
  { number: '03', title: 'Checkout', description: 'Enter your details and pay securely with the trusted checkout flow you already know.', icon: HiOutlineCreditCard },
  { number: '04', title: 'Receive', description: 'Track your order and enjoy a simple, dependable delivery experience.', icon: HiOutlineGift },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Easy shopping</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">Shopping Made Simple</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div key={number} className="relative rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
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
      </div>
    </section>
  );
};

export default HowItWorks;
