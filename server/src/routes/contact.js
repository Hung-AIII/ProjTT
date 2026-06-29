// server/src/routes/contact.js
const express = require('express')
const router = express.Router()
const {
  createContact,
  getContacts,
  markAsRead,
} = require('../controllers/contactController')
const { protect } = require('../middleware/auth')
const { admin } = require('../middleware/admin')

// @route   POST /api/contact   - user (không cần đăng nhập) gửi liên hệ
router.post('/', createContact)

// @route   GET /api/contact    - chỉ admin xem danh sách liên hệ
router.get('/', protect, admin, getContacts)

// @route   PUT /api/contact/:id/read - admin đánh dấu đã đọc
router.put('/:id/read', protect, admin, markAsRead)

module.exports = router