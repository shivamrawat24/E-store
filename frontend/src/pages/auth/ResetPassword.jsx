import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AuthCard from '../../components/common/AuthCard';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { resetPassword, clearAuthError } from '../../redux/slices/authSlice';

const ResetPassword = () => {
  const { token } = useParams();
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
  }, [dispatch]);

  const password = watch('password');

  const onSubmit = async ({ password: newPassword }) => {
    const result = await dispatch(resetPassword({ token, password: newPassword }));
    if (result.type.endsWith('/fulfilled')) {
      toast.success('Password reset successfully! You are now logged in.');
      navigate('/dashboard');
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before"
      footerText="Remembered your old password?"
      footerLinkText="Back to login"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          id="password"
          label="New password"
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
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          registration={register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" fullWidth isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;
