import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { initializeAuth, sessionExpired } from '../redux/slices/authSlice';
import { registerSessionExpiredHandler } from '../api/axiosInstance';

/**
 * Runs once when the app mounts:
 * 1. Attempts a silent token refresh (via httpOnly cookie) to restore
 *    the session after a page reload.
 * 2. Registers a handler so that if a refresh ever fails mid-session
 *    (e.g. refresh token revoked/expired), the Redux store is cleared
 *    and the user is notified.
 */
const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());

    registerSessionExpiredHandler(() => {
      dispatch(sessionExpired());
      toast.error('Your session has expired. Please log in again.');
    });
  }, [dispatch]);

  return children;
};

export default AuthBootstrap;
