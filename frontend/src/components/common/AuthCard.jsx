import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Consistent centered card shell used by Login, Signup, Forgot/Reset
 * Password, and Email Verification pages.
 */
const AuthCard = ({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-7 text-center">
          <Link to="/" className="text-xl font-bold tracking-tight text-ink-900">
            Ecommerce<span className="text-brand-600">Store</span>
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {children}

        {footerText && (
          <p className="mt-6 text-center text-sm text-gray-500">
            {footerText}{' '}
            <Link to={footerLinkTo} className="font-semibold text-brand-600 hover:text-brand-700">
              {footerLinkText}
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCard;
