import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/common/AuthCard';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { clearAuthError } from '../../redux/slices/authSlice';

const Login = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const onSubmit = async (formData) => {
    const result = await login(formData);
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Welcome back!');
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue shopping"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
          registration={register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          registration={register('password', { required: 'Password is required' })}
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Log In
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
