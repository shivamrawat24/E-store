import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const footerLinks = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?sort=new' },
      { label: 'Best Sellers', to: '/shop?sort=popular' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Shipping & Returns', to: '/shipping-returns' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink-900">
              <HiOutlineShoppingBag className="h-6 w-6 text-brand-600" />
              Ecommerce<span className="text-brand-600">Store</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Quality products, honest prices, and a shopping experience built around you.
            </p>
            <div className="mt-4 flex gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label="social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-ink-700 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-ink-900">{section.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-500 transition-colors hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} EcommerceStore. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-brand-600">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-brand-600">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
