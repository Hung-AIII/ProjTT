const mongoose = require('mongoose')
const Product = require('../models/Product')
 
// Helper: tìm theo _id (ObjectId) hoặc fallback tìm theo tên nếu id không hợp lệ
const findProductById = async (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id)
  if (isValidObjectId) {
    return await Product.findById(id)
  }
  return null
}
 
// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter).skip(skip).limit(limit)

    res.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}
 
// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await findProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 
// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, description, stock } = req.body
 
    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
    }
 
    const product = await Product.create({
      name,
      price: Number(price),
      image,
      category,
      description: description || '',
      stock: Number(stock) || 0,
    })
 
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 
// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await findProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
 
    const { name, price, image, category, description, stock } = req.body
 
    // ✅ Dùng ?? thay vì || để không bị mất giá trị 0 hoặc chuỗi rỗng hợp lệ
    product.name        = name        !== undefined ? name        : product.name
    product.price       = price       !== undefined ? Number(price) : product.price
    product.image       = image       !== undefined ? image       : product.image
    product.category    = category    !== undefined ? category    : product.category
    product.description = description !== undefined ? description : product.description
    product.stock       = stock       !== undefined ? Number(stock) : product.stock
 
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 
// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await findProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
 
    await product.deleteOne()
    res.json({ success: true, message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// @desc    Đánh giá sản phẩm
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' })
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.averageRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Đánh giá thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}
// @desc    Lấy TẤT CẢ đánh giá từ mọi sản phẩm (dành cho Admin quản lý)
// @route   GET /api/products/reviews/all
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .select('name image reviews')

    const allReviews = []
    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          productImage: product.image,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          adminReply: review.adminReply,
          repliedAt: review.repliedAt,
          createdAt: review.createdAt,
        })
      })
    })

    // Mới nhất lên đầu
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(allReviews)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}

// @desc    Admin trả lời 1 đánh giá
// @route   PUT /api/products/:productId/reviews/:reviewId/reply
// @access  Private/Admin
const replyReview = async (req, res) => {
  try {
    const { reply } = req.body
    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: 'Nội dung trả lời không được để trống' })
    }

    const product = await Product.findById(req.params.productId)
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })

    const review = product.reviews.id(req.params.reviewId)
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' })

    review.adminReply = reply.trim()
    review.repliedAt = new Date()
    await product.save()

    res.json({ message: 'Đã trả lời đánh giá' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}

// @desc    Admin xoá 1 đánh giá
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    )
    product.numReviews = product.reviews.length
    product.averageRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

    await product.save()
    res.json({ message: 'Đã xoá đánh giá' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  replyReview,
  deleteReview,
}