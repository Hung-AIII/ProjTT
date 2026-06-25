const Order = require('../models/Order')
const Product = require('../models/Product')

const createOrder = async (req, res) => {
  try {
    const { items, total, shipping, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' })
    }

    if (!shipping?.name || !shipping?.phone || !shipping?.address) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin giao hàng' })
    }

    // Kiểm tra tồn kho trước khi tạo đơn
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId)
        if (!product) {
          return res.status(400).json({ success: false, message: `Không tìm thấy sản phẩm: ${item.name}` })
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho`
          })
        }
      }
    }

    const orderItems = items.map(item => ({
      name: item.name || 'Sản phẩm',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || '',
      product: item.productId || undefined
    }))

    const totalPrice = Number(total) || orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        name: shipping.name,
        phone: shipping.phone,
        address: shipping.address,
        note: shipping.note || ''
      },
      totalPrice,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending'
    })

    // Trừ tồn kho
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -Number(item.quantity) } })
      } else {
        await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: -Number(item.quantity) } })
      }
    }

    // Cảnh báo sắp hết hàng
    const lowStockItems = await Product.find({ stock: { $lte: 5, $gt: 0 } }).select('name stock')
    const outOfStockItems = await Product.find({ stock: { $lte: 0 } }).select('name stock')

    console.log('✅ Tạo đơn hàng thành công ID:', order._id)

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      order,
      warnings: { lowStock: lowStockItems, outOfStock: outOfStockItems }
    })

  } catch (error) {
    console.error('❌ Lỗi tạo đơn hàng:', error.message)
    res.status(500).json({ success: false, message: error.message || 'Lỗi server' })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    // Hoàn lại tồn kho nếu admin hủy đơn
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: Number(item.quantity) } })
        } else {
          await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: Number(item.quantity) } })
        }
      }
      console.log('🔄 Hoàn lại tồn kho cho đơn hủy:', order._id)
    }

    order.status = status

    // Khi admin đổi sang "delivered" = đã giao + đã nhận tiền
    if (status === 'delivered') {
      order.isPaid = true
      order.paidAt = new Date()
      console.log('💰 Đơn hàng đã được thanh toán:', order._id)
    }

    // Khi hủy đơn đã paid → thu hồi isPaid
    if (status === 'cancelled' && order.isPaid) {
      order.isPaid = false
      order.paidAt = null
    }

    await order.save()

    res.json({ success: true, message: 'Cập nhật trạng thái thành công', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        message: order.status === 'cancelled'
          ? 'Đơn hàng đã được hủy trước đó'
          : 'Đơn hàng đang được xử lý, không thể hủy. Vui lòng liên hệ shop.'
      })
    }

    // Hoàn lại tồn kho
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: Number(item.quantity) } })
      } else {
        await Product.findOneAndUpdate({ name: item.name }, { $inc: { stock: Number(item.quantity) } })
      }
    }

    order.status = 'cancelled'
    await order.save()

    console.log('✅ User hủy đơn hàng:', order._id)
    res.json({ success: true, message: 'Đã hủy đơn hàng thành công', order })
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