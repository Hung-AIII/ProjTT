const express = require('express')
const router = express.Router()
const {
  register, login, getMe, getUsers,
  updateProfile, changePassword   // ✅ Thêm 2 cái mới
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')
const { forgotPassword, resetPassword } = require('../controllers/authController')
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/users', protect, admin, getUsers)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)
// ✅ THÊM 2 ROUTE MỚI
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

module.exports = router