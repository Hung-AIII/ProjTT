const Cart = require('../models/Cart')
const Product = require('../models/Product')

// @desc    Lấy giỏ hàng của user hiện tại
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    
    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      })
    }
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    
    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: req.user._id })
    
    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      })
    }
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existItem = cart.items.find(
      (item) => item.product.toString() === productId
    )
    
    if (existItem) {
      // Nếu đã có, tăng số lượng
      existItem.quantity += quantity
    } else {
      // Nếu chưa có, thêm mới
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    }
    
    // Lưu giỏ hàng (tự động tính lại totalPrice)
    await cart.save()
    
    // Populate để lấy thông tin sản phẩm đầy đủ
    await cart.populate('items.product')
    
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cập nhật số lượng sản phẩm trong giỏ
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body
    
    if (quantity < 0) {
      return res.status(400).json({ message: 'Số lượng không hợp lệ' })
    }
    
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
    }
    
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' })
    }
    
    if (quantity === 0) {
      // Xóa sản phẩm khỏi giỏ
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
    
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Xóa sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
    }
    
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )
    
    await cart.save()
    await cart.populate('items.product')
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Xóa toàn bộ giỏ hàng
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
    }
    
    cart.items = []
    await cart.save()
    
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng', cart })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}