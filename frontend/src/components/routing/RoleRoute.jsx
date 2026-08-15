import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import FullScreenLoader from '../common/FullScreenLoader';

/**
 * Restricts a subtree of routes to specific roles. Must be nested inside
 * ProtectedRoute (or used after auth is known) since it assumes the user
 * is already authenticated; it only checks the role.
 *
 * Usage: <Route element={<RoleRoute allowedRoles={['admin']} />}> ... </Route>
 */
const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, bootstrapped } = useAuth();

  if (!bootstrapped) {
    return <FullScreenLoader label="Checking permissions..." />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
