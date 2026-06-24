const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới
// @access  Private
router.post('/', protect, createOrder)

// @route   GET /api/orders/me
// @desc    Lấy đơn hàng của user hiện tại
// @access  Private
router.get('/me', protect, getMyOrders)

// @route   GET /api/orders/:id
// @desc    Lấy chi tiết 1 đơn hàng
// @access  Private
router.get('/:id', protect, getOrderById)

// @route   PUT /api/orders/:id/cancel
// @desc    Hủy đơn hàng
// @access  Private
router.put('/:id/cancel', protect, cancelOrder)

// ===== ADMIN ROUTES =====
// @route   GET /api/orders
// @desc    Lấy tất cả đơn hàng (Admin)
// @access  Private/Admin
router.get('/', protect, admin, getAllOrders)

// @route   PUT /api/orders/:id/status
// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus)

module.exports = router