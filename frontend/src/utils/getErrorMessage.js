/**
 * Extracts the most useful human-readable message from an axios error,
 * falling back gracefully when the backend didn't return the expected shape.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  const data = error.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(' ');
  }
  if (data?.message) return data.message;
  if (error.message === 'Network Error') return 'Unable to reach the server. Please check your connection.';
  return fallback;
};
