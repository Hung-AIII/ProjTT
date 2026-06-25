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

// ===== PUBLIC (cần đăng nhập) =====

// POST /api/orders — Tạo đơn hàng mới
router.post('/', protect, createOrder)

// GET /api/orders/me — Lấy đơn của user hiện tại
// ⚠️ PHẢI đặt TRƯỚC /:id để không bị match nhầm
router.get('/me', protect, getMyOrders)

// PUT /api/orders/:id/cancel — User tự hủy đơn
// ⚠️ PHẢI đặt TRƯỚC /:id/status
router.put('/:id/cancel', protect, cancelOrder)

// GET /api/orders/:id — Lấy chi tiết 1 đơn
router.get('/:id', protect, getOrderById)

// ===== ADMIN ONLY =====

// GET /api/orders — Lấy tất cả đơn (Admin)
// ⚠️ PHẢI đặt SAU /me vì / match sau các route cụ thể
router.get('/', protect, admin, getAllOrders)

// PUT /api/orders/:id/status — Cập nhật trạng thái (Admin)
router.put('/:id/status', protect, admin, updateOrderStatus)

module.exports = router