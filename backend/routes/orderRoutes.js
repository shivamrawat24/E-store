const express = require('express');
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const {
  createOrderValidator,
  verifyPaymentValidator,
  updateOrderStatusValidator,
} = require('../validators/orderValidators');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// All order routes require authentication.
router.use(protect);

// ---------- Customer ----------
router.post('/', createOrderValidator, createOrder);
router.post('/verify', verifyPaymentValidator, verifyPayment);
router.get('/my', getMyOrders);

// ---------- Admin ----------
// NOTE: '/' (list all) is registered before the '/:id' catch-all below,
// and is admin-only; '/my' above already claimed the customer's own list.
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatusValidator, updateOrderStatus);

// ---------- Shared (owner or admin — enforced inside the controller) ----------
router.patch('/:id/cancel', cancelOrder);
router.get('/:id', getOrder);

module.exports = router;
