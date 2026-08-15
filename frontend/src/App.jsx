import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import GuestRoute from './components/routing/GuestRoute';
import RoleRoute from './components/routing/RoleRoute';

import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

import Shop from './pages/shop/Shop';
import ProductDetails from './pages/shop/ProductDetails';
import CategoryPage from './pages/shop/CategoryPage';
import CartPage from './pages/cart/CartPage';

// Day 4 - Checkout & Orders
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/checkout/OrderSuccess';
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';

import AdminProducts from './pages/admin/AdminProducts';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <Routes>
      {/* Public / authenticated storefront pages sharing Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* User-protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Day 4 - Checkout & Orders */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin console: own layout (sidebar), requires auth + admin role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AdminProductAdd />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/brands" element={<AdminBrands />} />

            {/* Day 4 - Admin Orders */}
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Route>

      {/* Auth pages: guest-only, own full-screen layout (no Navbar/Footer) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Email verification is accessible regardless of auth state */}
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;