const express = require('express')
const router = express.Router()
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

// Tất cả các route đều yêu cầu xác thực
router.use(protect)

// @route   GET /api/cart
// @desc    Lấy giỏ hàng của user hiện tại
router.get('/', getCart)

// @route   POST /api/cart
// @desc    Thêm sản phẩm vào giỏ hàng
router.post('/', addToCart)

// @route   PUT /api/cart/:productId
// @desc    Cập nhật số lượng sản phẩm trong giỏ
router.put('/:productId', updateCartItem)

// @route   DELETE /api/cart/:productId
// @desc    Xóa sản phẩm khỏi giỏ hàng
router.delete('/:productId', removeFromCart)

// @route   DELETE /api/cart
// @desc    Xóa toàn bộ giỏ hàng
router.delete('/', clearCart)

module.exports = router