import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import FullScreenLoader from '../common/FullScreenLoader';

/**
 * Prevents an already-authenticated user from seeing Login/Signup again;
 * sends them straight to their dashboard instead.
 */
const GuestRoute = () => {
  const { isAuthenticated, bootstrapped } = useAuth();

  if (!bootstrapped) {
    return <FullScreenLoader label="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
