/**
 * Labeled text input designed to be spread with react-hook-form's
 * `register(...)` return value. Shows a field-level error message
 * when `error` is provided.
 */
const FormInput = ({ label, id, type = 'text', error, registration, rightElement, ...rest }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/40 ${
            error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'
          } ${rightElement ? 'pr-10' : ''}`}
          {...registration}
          {...rest}
        />
        {rightElement && <div className="absolute inset-y-0 right-2 flex items-center">{rightElement}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormInput;
