import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineShoppingCart, HiOutlineArrowLeft } from 'react-icons/hi';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { createOrder, verifyPayment, clearCheckoutOrder } from '../../redux/slices/orderSlice';
import { loadRazorpayScript } from '../../utils/loadRazorpayScript';
import ShippingAddressForm from '../../components/checkout/ShippingAddressForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import RazorpayButton from '../../components/checkout/RazorpayButton';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: user?.name || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={HiOutlineShoppingCart}
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const onSubmit = async (shippingAddress) => {
    setIsProcessing(true);
    try {
      const orderItems = items.map((item) => ({ product: item.productId, quantity: item.quantity }));

      // Step 1: server validates stock/prices and creates a pending order
      // + matching Razorpay order. Nothing here is trusted — the backend
      // recalculates everything from live product data.
      const { order, razorpayOrder, keyId } = await dispatch(createOrder({ orderItems, shippingAddress })).unwrap();

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Unable to load the payment gateway. Please check your connection and try again.');
        setIsProcessing(false);
        return;
      }

      // Step 2: open Razorpay Checkout for the exact amount the backend computed.
      const razorpayOptions = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: 'EcommerceStore',
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: user?.email || '',
        },
        theme: { color: '#be185d' },
        handler: async (response) => {
          try {
            // Step 3: backend verifies the signature with the Razorpay
            // secret before ever marking the order paid or touching stock.
            await dispatch(
              verifyPayment({
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            clear();
            dispatch(clearCheckoutOrder());
            toast.success('Payment successful! Your order is confirmed.');
            navigate(`/order-success/${order._id}`);
          } catch (verifyError) {
            toast.error(verifyError || 'Payment verification failed. Please contact support if you were charged.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: 'ℹ️' });
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error || 'Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-ink-900">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ShippingAddressForm register={register} errors={errors} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary items={items} subtotal={subtotal}>
            <div className="mt-4">
              <RazorpayButton isProcessing={isProcessing} disabled={isProcessing} />
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              You'll be redirected to Razorpay to complete your payment securely.
            </p>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
