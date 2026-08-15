import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AuthCard from '../../components/common/AuthCard';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { forgotPassword, clearAuthError, clearAuthMessage } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const onSubmit = async ({ email }) => {
    const result = await dispatch(forgotPassword(email));
    if (result.type.endsWith('/fulfilled')) {
      setSubmitted(true);
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  if (submitted) {
    return (
      <AuthCard title="Check your inbox" footerText="Remembered it?" footerLinkText="Back to login" footerLinkTo="/login">
        <div className="rounded-lg bg-green-50 px-4 py-4 text-sm text-green-700">
          If an account exists for <strong>{getValues('email')}</strong>, a password reset link is on its way. The link
          expires in 15 minutes.
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
      footerText="Remembered it?"
      footerLinkText="Back to login"
      footerLinkTo="/login"
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

        {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;
