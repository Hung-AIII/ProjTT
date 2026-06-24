const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

// @route   GET /api/products
// @desc    Lấy tất cả sản phẩm
// @access  Public
router.get('/', getProducts)

// @route   GET /api/products/:id
// @desc    Lấy chi tiết 1 sản phẩm
// @access  Public
router.get('/:id', getProductById)

// @route   POST /api/products
// @desc    Tạo sản phẩm mới
// @access  Private/Admin
router.post('/', protect, admin, createProduct)

// @route   PUT /api/products/:id
// @desc    Cập nhật sản phẩm
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct)

// @route   DELETE /api/products/:id
// @desc    Xóa sản phẩm
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct)

module.exports = router