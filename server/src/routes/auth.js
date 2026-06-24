const express = require('express')
const router = express.Router()
const { register, login, getMe, getUsers } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')  // ← THÊM DÒNG NÀY

// @route   POST /api/auth/register
router.post('/register', register)

// @route   POST /api/auth/login
router.post('/login', login)

// @route   GET /api/auth/me
router.get('/me', protect, getMe)

// @route   GET /api/auth/users (Admin)
router.get('/users', protect, admin, getUsers)

module.exports = router