const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const calculateOrderPricing = require('../utils/calculateOrderPricing');
const razorpay = require('../config/razorpay');
const env = require('../config/env');
const logger = require('../config/logger');

const isRazorpayConfigured = () => Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

/**
 * @route   POST /api/v1/orders
 * @desc    Validates the cart against live product data, computes the real
 *          order total server-side, creates a Razorpay order for that
 *          amount, and stores a matching "pending" Order in MongoDB.
 *          Nothing about price/stock/amount is trusted from the client —
 *          only productId + quantity are read from the request body.
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    throw new ApiError(503, 'Payment gateway is not configured yet. Please try again later.');
  }

  const { orderItems, shippingAddress } = req.body;

  // Re-fetch every product from the DB. This is the security boundary:
  // price, name, image, and stock all come from here, never from req.body.
  const productIds = orderItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const resolvedItems = [];
  for (const requestedItem of orderItems) {
    const product = productMap.get(requestedItem.product);

    if (!product) {
      throw ApiError.badRequest(`One of the products in your cart is no longer available.`);
    }
    if (product.status !== 'active') {
      throw ApiError.badRequest(`"${product.name}" is not currently available for purchase.`);
    }
    if (product.stock < requestedItem.quantity) {
      throw ApiError.badRequest(
        `Only ${product.stock} unit(s) of "${product.name}" left in stock. Please update your cart.`
      );
    }

    const subtotal = Math.round(product.price * requestedItem.quantity * 100) / 100;
    resolvedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity: requestedItem.quantity,
      subtotal,
    });
  }

  const itemsPrice = Math.round(resolvedItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  const { shippingPrice, taxPrice, totalPrice } = calculateOrderPricing(itemsPrice);

  // Razorpay expects the smallest currency unit (paise for INR), as an integer.
  const amountInPaise = Math.round(totalPrice * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { userId: req.user._id.toString() },
    });
  } catch (error) {
    logger.error(`Razorpay order creation failed: ${error.message}`);
    throw new ApiError(502, 'Unable to initiate payment right now. Please try again.');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems: resolvedItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod: 'razorpay',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    razorpayOrderId: razorpayOrder.id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        order,
        razorpayOrder: { id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency },
        keyId: env.RAZORPAY_KEY_ID,
      },
      'Order created. Proceed to payment.'
    )
  );
});

/**
 * @route   POST /api/v1/orders/verify
 * @desc    Verifies the Razorpay payment signature server-side using the
 *          key secret. Only on a valid signature do we mark the order paid
 *          and decrement stock — the frontend's word alone is never enough.
 * @access  Private
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature } =
    req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found.');

  if (order.paymentStatus === 'paid') {
    return res.status(200).json(new ApiResponse(200, { order }, 'Payment already verified.'));
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw ApiError.badRequest('This payment does not match the order on record.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const isValidSignature =
    expectedSignature.length === razorpaySignature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));

  if (!isValidSignature) {
    order.paymentStatus = 'failed';
    await order.save();
    logger.warn(`Payment signature mismatch for order ${order._id}`);
    throw ApiError.badRequest('Payment verification failed. If money was deducted, it will be refunded automatically.');
  }

  // Signature is valid — decrement stock now, atomically, and never below zero.
  for (const item of order.orderItems) {
    await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    // Note: if a product's stock changed between order creation and payment
    // (race condition), this update silently no-ops rather than going
    // negative. Documented as a known limitation — see SESSION_MANIFEST.
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paidAt = new Date();
  await order.save();

  return res.status(200).json(new ApiResponse(200, { order }, 'Payment verified. Order confirmed.'));
});

/**
 * @route   GET /api/v1/orders/my
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments({ user: req.user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { orders, pagination: { page, limit, totalResults: total, totalPages: Math.ceil(total / limit) || 1 } },
      'Orders fetched.'
    )
  );
});

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Owner can view their own order; admins can view any order.
 * @access  Private
 */
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw ApiError.notFound('Order not found.');

  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not have permission to view this order.');
  }

  return res.status(200).json(new ApiResponse(200, { order }, 'Order fetched.'));
});

/**
 * @route   GET /api/v1/orders
 * @desc    Admin order list with basic filtering + pagination.
 * @access  Private/Admin
 * @query   orderStatus, paymentStatus, search, sort, page, limit
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const searchTerm = req.query.search?.trim();
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const matchingUserIds = await User.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).distinct('_id');
    const normalizedObjectId = mongoose.Types.ObjectId.isValid(searchTerm) ? searchTerm : null;

    filter.$or = [{ user: { $in: matchingUserIds } }];
    if (normalizedObjectId) {
      filter.$or.push({ _id: normalizedObjectId });
    }
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const sortValue = req.query.sort === 'oldest' ? 'createdAt' : '-createdAt';

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort(sortValue)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { orders, pagination: { page, limit, totalResults: total, totalPages: Math.ceil(total / limit) || 1 } },
      'Orders fetched.'
    )
  );
});

const VALID_ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const isValidOrderStatusTransition = (currentStatus, nextStatus) => {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true;
  return (VALID_ORDER_STATUS_TRANSITIONS[currentStatus] || []).includes(nextStatus);
};

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found.');

  const nextStatus = req.body.orderStatus;
  if (!isValidOrderStatusTransition(order.orderStatus, nextStatus)) {
    throw ApiError.badRequest(`Invalid order status transition from "${order.orderStatus}" to "${nextStatus}".`);
  }

  order.orderStatus = nextStatus;
  if (nextStatus === 'delivered' && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }
  await order.save();

  return res.status(200).json(new ApiResponse(200, { order }, 'Order status updated.'));
});

/**
 * @route   PATCH /api/v1/orders/:id/cancel
 * @desc    Cancels an order when the requester is the owner or an admin.
 *          This intentionally does not trigger a Razorpay refund.
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found.');

  const isOwner = order.user.toString() === req.user._id.toString();
  if (req.user.role !== 'admin' && !isOwner) {
    throw ApiError.forbidden('You do not have permission to cancel this order.');
  }

  if (order.orderStatus === 'cancelled') {
    throw ApiError.badRequest('This order has already been cancelled.');
  }

  const cancellableStatuses = ['pending', 'confirmed', 'processing'];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw ApiError.badRequest('This order cannot be cancelled because it has already been shipped or delivered.');
  }

  order.orderStatus = 'cancelled';
  await order.save();

  // Day 4 decremented stock only after successful payment verification.
  // There is no persisted per-order stock-decrement flag, so the safest
  // restoration is to restore once when the order was paid and is being
  // cancelled for the first time. The orderStatus guard above prevents a
  // second cancellation from restoring stock twice.
  if (order.paymentStatus === 'paid') {
    for (const item of order.orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
  }

  return res.status(200).json(new ApiResponse(200, { order }, 'Order cancelled successfully.'));
});

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
