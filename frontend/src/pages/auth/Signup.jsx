import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/common/AuthCard';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError, clearAuthMessage } from '../../redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const password = watch('password');

  const onSubmit = async (formData) => {
    const { confirmPassword, ...payload } = formData;
    const result = await dispatch(registerUser(payload));
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Account created! Please check your email to verify your address.');
      navigate('/login');
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join us and start shopping today"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          id="name"
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name}
          registration={register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
          })}
        />
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
          registration={register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Must include an uppercase letter, lowercase letter, and a number',
            },
          })}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>

        <p className="text-center text-xs text-gray-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthCard>
  );
};

export default Signup;
