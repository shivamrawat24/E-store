import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineSparkles,
  HiOutlineClipboardList,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const navItems = [
  { label: 'Overview', to: '/admin/dashboard', icon: HiOutlineViewGrid, end: true },
  { label: 'Products', to: '/admin/products', icon: HiOutlineCube },
  { label: 'Categories', to: '/admin/categories', icon: HiOutlineTag },
  { label: 'Brands', to: '/admin/brands', icon: HiOutlineSparkles },
  { label: 'Orders', to: '/admin/orders', icon: HiOutlineClipboardList },
];

const AdminSidebar = () => {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Store
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;