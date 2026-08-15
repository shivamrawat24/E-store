import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import FullScreenLoader from '../common/FullScreenLoader';

/**
 * Blocks access until the auth bootstrap check has completed, then
 * redirects unauthenticated users to /login, preserving the intended
 * destination so we can send them back after they sign in.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return <FullScreenLoader label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
