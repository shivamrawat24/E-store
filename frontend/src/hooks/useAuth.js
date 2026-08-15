import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, logoutUser, registerUser } from '../redux/slices/authSlice';

/**
 * Central hook for reading auth state and dispatching auth actions,
 * so components don't need to import useDispatch/useSelector directly.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, bootstrapped, error, message } = useSelector((state) => state.auth);

  const login = useCallback((payload) => dispatch(loginUser(payload)), [dispatch]);
  const register = useCallback((payload) => dispatch(registerUser(payload)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    bootstrapped,
    error,
    message,
    login,
    register,
    logout,
  };
};

export default useAuth;
