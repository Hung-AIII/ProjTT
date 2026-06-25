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
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
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
 
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}