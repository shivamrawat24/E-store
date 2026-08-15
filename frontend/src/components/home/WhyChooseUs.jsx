import { HiOutlineBadgeCheck, HiOutlineHeart, HiOutlineLockClosed, HiOutlineLightningBolt } from 'react-icons/hi';

const reasons = [
  {
    icon: HiOutlineBadgeCheck,
    title: 'Carefully Selected Products',
    description: 'We focus on items that are practical, elevated, and genuinely worth adding to your everyday routine.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Thoughtful Pricing',
    description: 'Transparent value for quality products, with pricing that feels fair from the first click to checkout.',
  },
  {
    icon: HiOutlineLockClosed,
    title: 'Secure Checkout',
    description: 'Your order details are handled with the same care and confidence you expect from a premium storefront.',
  },
  {
    icon: HiOutlineHeart,
    title: 'Customer First',
    description: 'Our shopping experience is built to keep things simple, reliable, and enjoyable from start to finish.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Why us</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-900">Why Shop With Us?</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-[1.5rem] border border-gray-200 bg-white p-6 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
