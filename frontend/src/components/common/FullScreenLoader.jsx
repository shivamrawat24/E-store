import Spinner from './Spinner';

/**
 * Blocks the entire viewport with a centered spinner.
 * Used while the silent-refresh / session bootstrap is in flight so
 * protected routes never flash before auth state is known.
 */
const FullScreenLoader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
};

export default FullScreenLoader;
