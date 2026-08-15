import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { label: 'Overview', to: '/admin/dashboard' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Brands', to: '/admin/brands' },
  { label: 'Orders', to: '/admin/orders' },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3.5 sm:px-6">
          {/* Mobile nav */}
          <select
            value={location.pathname}
            onChange={(e) => navigate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm lg:hidden"
          >
            {navItems.map((item) => (
              <option key={item.to} value={item.to}>
                {item.label}
              </option>
            ))}
          </select>

          <h2 className="hidden text-sm font-semibold text-ink-900 lg:block">
            Admin Panel
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden sm:inline">Signed in as</span>
            <span className="font-medium text-ink-900">{user?.name}</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;