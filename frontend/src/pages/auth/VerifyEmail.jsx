import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import AuthCard from '../../components/common/AuthCard';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import { verifyEmail, resendVerification } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  const runVerification = useCallback(async () => {
    setState('verifying');
    const result = await dispatch(verifyEmail(token));
    if (result.type.endsWith('/fulfilled')) {
      setState('success');
      setMessage(result.payload);
    } else {
      setState('error');
      setMessage(result.payload || 'Verification failed.');
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) runVerification();
  }, [token, runVerification]);

  const handleResend = async () => {
    const email = window.prompt('Enter the email you registered with:');
    if (!email) return;
    const result = await dispatch(resendVerification(email));
    if (result.type.endsWith('/fulfilled')) {
      toast.success(result.payload);
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <AuthCard title="Email Verification">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {state === 'verifying' && (
          <>
            <Spinner size="lg" />
            <p className="text-sm text-gray-500">Verifying your email address...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <HiOutlineCheckCircle className="h-14 w-14 text-green-500" />
            <p className="text-sm font-medium text-ink-900">{message}</p>
            <Link to="/login" className="w-full">
              <Button fullWidth>Continue to Login</Button>
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <HiOutlineXCircle className="h-14 w-14 text-red-500" />
            <p className="text-sm font-medium text-ink-900">{message}</p>
            <Button fullWidth onClick={handleResend}>
              Resend Verification Email
            </Button>
            <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Back to login
            </Link>
          </>
        )}
      </div>
    </AuthCard>
  );
};

export default VerifyEmail;
