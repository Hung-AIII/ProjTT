const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng' })
    const user = await User.create({ name, email, password })
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
    })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
    })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

// ✅ MỚI: Cập nhật tên
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tên không được để trống' })
    }
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' })

    user.name = name.trim()
    await user.save()

    res.json({
      _id: user._id, name: user.name,
      email: user.email, role: user.role
    })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

// ✅ MỚI: Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới tối thiểu 6 ký tự' })
    }

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' })

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' })
    }

    user.password = newPassword  // schema sẽ tự hash
    await user.save()

    res.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}


module.exports = { register, login, getMe, getUsers, updateProfile, changePassword }