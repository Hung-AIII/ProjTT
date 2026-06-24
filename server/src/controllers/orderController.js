const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    console.log('📦 Dữ liệu nhận được:', JSON.stringify(req.body, null, 2))

    const { items, total, shipping } = req.body

    // Kiểm tra dữ liệu
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Giỏ hàng trống' 
      })
    }

    if (!shipping || !shipping.name || !shipping.phone || !shipping.address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin giao hàng' 
      })
    }

    // Format lại items cho đúng schema
    const orderItems = items.map(item => ({
      name: item.name || 'Sản phẩm',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || ''
    }))

    // Tạo đơn hàng
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        name: shipping.name,
        phone: shipping.phone,
        address: shipping.address,
        note: shipping.note || ''
      },
      totalPrice: Number(total) || orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'pending'
    })

    console.log('✅ Đã tạo đơn hàng ID:', order._id)

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order
    })

  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error.message)
    console.error('❌ Stack:', error.stack)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Lỗi server khi tạo đơn hàng'
    })
  }
}

// @desc    Lấy đơn hàng của user hiện tại
// @route   GET /api/orders/me
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Lấy chi tiết 1 đơn hàng
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    // Kiểm tra user có quyền xem đơn hàng này không
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    order.status = status
    await order.save()

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Hủy đơn hàng (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    // Kiểm tra user có quyền hủy đơn hàng này không
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' })
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ message: 'Đơn hàng đã được xử lý, không thể hủy' })
    }

    order.status = 'cancelled'
    await order.save()

    res.json({
      success: true,
      message: 'Đã hủy đơn hàng',
      order,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
}