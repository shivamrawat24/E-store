import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Signed in as {user?.email} (role: admin)</p>

      <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
        Product, order, and user management modules will be built in upcoming days.
      </div>
    </div>
  );
};

export default AdminDashboard;
