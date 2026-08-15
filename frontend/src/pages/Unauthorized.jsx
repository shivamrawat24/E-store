import { Link } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi';
import Button from '../components/common/Button';

const Unauthorized = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <HiOutlineLockClosed className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-ink-900">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        You don't have permission to view this page. If you think this is a mistake, contact support.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
