const { body } = require('express-validator');
const { validate } = require('./validate');

const createOrderValidator = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('orderItems.*.product').isMongoId().withMessage('Invalid product ID in order items'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1 for every item'),

  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 7, max: 20 })
    .withMessage('Enter a valid phone number'),
  body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('shippingAddress.addressLine2').optional({ checkFalsy: true }).trim(),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').optional({ checkFalsy: true }).trim(),

  validate,
];

const verifyPaymentValidator = [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('razorpay_order_id').trim().notEmpty().withMessage('Missing razorpay_order_id'),
  body('razorpay_payment_id').trim().notEmpty().withMessage('Missing razorpay_payment_id'),
  body('razorpay_signature').trim().notEmpty().withMessage('Missing razorpay_signature'),
  validate,
];

const updateOrderStatusValidator = [
  body('orderStatus')
    .trim()
    .notEmpty()
    .withMessage('orderStatus is required')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status value'),
  validate,
];

module.exports = { createOrderValidator, verifyPaymentValidator, updateOrderStatusValidator };
