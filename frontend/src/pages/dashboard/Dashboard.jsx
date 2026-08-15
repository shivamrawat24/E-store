import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-sm text-gray-500">Here's a quick overview of your account.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Account status</p>
          <p className="mt-2 text-lg font-semibold text-ink-900">
            {user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Role</p>
          <p className="mt-2 text-lg font-semibold capitalize text-ink-900">{user?.role}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</p>
          <p className="mt-2 truncate text-lg font-semibold text-ink-900">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
