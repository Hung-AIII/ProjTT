const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Load environment variables
dotenv.config()

// Kết nối MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/contact', require('./routes/contact'))

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('🚀 API Hùng Hà Shop đang chạy!')
})

// Middleware xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn này' })
})

// Khởi chạy server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`)
  console.log(`🌐 http://localhost:${PORT}`)
})