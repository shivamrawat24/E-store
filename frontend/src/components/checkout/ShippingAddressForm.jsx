import FormInput from '../common/FormInput';

/**
 * Pure field set, not its own <form>. Checkout.jsx owns the single
 * react-hook-form instance and passes `register`/`errors` down, so
 * shipping fields submit together with the rest of the checkout in one go.
 */
const ShippingAddressForm = ({ register, errors }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-ink-900">Shipping Address</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput
          id="fullName"
          label="Full Name"
          error={errors.fullName}
          registration={register('fullName', { required: 'Full name is required' })}
        />
        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          error={errors.phone}
          registration={register('phone', {
            required: 'Phone number is required',
            minLength: { value: 7, message: 'Enter a valid phone number' },
          })}
        />
        <div className="sm:col-span-2">
          <FormInput
            id="addressLine1"
            label="Address Line 1"
            error={errors.addressLine1}
            registration={register('addressLine1', { required: 'Address is required' })}
          />
        </div>
        <div className="sm:col-span-2">
          <FormInput
            id="addressLine2"
            label="Address Line 2 (optional)"
            error={errors.addressLine2}
            registration={register('addressLine2')}
          />
        </div>
        <FormInput id="city" label="City" error={errors.city} registration={register('city', { required: 'City is required' })} />
        <FormInput
          id="state"
          label="State"
          error={errors.state}
          registration={register('state', { required: 'State is required' })}
        />
        <FormInput
          id="postalCode"
          label="Postal Code"
          error={errors.postalCode}
          registration={register('postalCode', { required: 'Postal code is required' })}
        />
        <FormInput
          id="country"
          label="Country"
          error={errors.country}
          registration={register('country', { required: 'Country is required' })}
        />
      </div>
    </section>
  );
};

export default ShippingAddressForm;
