const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  replyReview,
  deleteReview,
} = require('../controllers/productController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

// ⚠️ Route '/reviews/all' phải đặt TRƯỚC '/:id' để không bị match nhầm thành id="reviews"
router.get('/reviews/all', protect, admin, getAllReviews)

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

router.post('/:id/reviews', protect, createReview)
router.put('/:productId/reviews/:reviewId/reply', protect, admin, replyReview)
router.delete('/:productId/reviews/:reviewId', protect, admin, deleteReview)

module.exports = router