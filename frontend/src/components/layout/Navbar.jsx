import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import useCart from '../../hooks/useCart';
import MiniCart from '../cart/MiniCart';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
];

const linkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-600' : 'text-ink-700 hover:text-brand-600'
  }`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  // IMPORTANT: useCart must be called INSIDE the component
  const { count: cartCount, toggleCart } = useCart();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-ink-900"
        >
          <HiOutlineShoppingBag className="h-6 w-6 text-brand-600" />
          EcommerceStore
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-ink-700 hover:text-brand-600"
                >
                  Admin
                </Link>
              )}

              <Link
                to="/orders"
                className="text-sm font-medium text-ink-700 hover:text-brand-600"
              >
                My Orders
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-brand-600"
              >
                <HiOutlineUserCircle className="h-5 w-5" />
                {user?.name?.split(' ')[0] || 'Account'}
              </Link>

              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-700 hover:text-brand-600"
              >
                Login
              </Link>

              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile / Cart controls */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-gray-100"
            aria-label="Open cart"
          >
            <HiOutlineShoppingCart className="h-5.5 w-5.5" />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-2 text-ink-900 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <HiOutlineX className="h-6 w-6" />
            ) : (
              <HiOutlineMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mini Cart */}
      <MiniCart />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-200 md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              <hr className="border-gray-200" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-ink-700"
                  >
                    My Account
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-ink-700"
                  >
                    My Orders
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-ink-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-ink-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Button fullWidth>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;