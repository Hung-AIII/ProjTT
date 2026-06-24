const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./src/models/Product')
const products = require('./products.json')

dotenv.config()

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Đã kết nối MongoDB')

    await Product.deleteMany()
    console.log('🗑️ Đã xóa dữ liệu cũ')

    await Product.insertMany(products)
    console.log(`✅ Đã thêm ${products.length} sản phẩm vào database`)

    process.exit()
  } catch (error) {
    console.error('❌ Lỗi:', error)
    process.exit(1)
  }
}

seedDB()