import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
  },

  actions: {
    // Thêm sản phẩm vào giỏ
    addToCart(product, quantity = 1) {
  // Lấy ID đúng từ MongoDB (_id)
  const productId = product._id || product.id
  
  const existingItem = this.items.find(item => item.id === productId)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    this.items.push({
      id: productId,           // ← dùng _id từ MongoDB
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    })
  }
  this.saveCart()
},

    // Xóa sản phẩm khỏi giỏ
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveCart()
    },

    // Cập nhật số lượng
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
          this.saveCart()
        }
      }
    },

    // Xóa toàn bộ giỏ
    clearCart() {
      this.items = []
      this.saveCart()
    },

    // Lưu giỏ hàng vào localStorage
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    // Đồng bộ giỏ hàng với server (khi đã đăng nhập)
    async syncCart() {
      try {
        const response = await axios.get('/api/cart')
        // Nếu có giỏ hàng trên server, merge với giỏ hàng local
        if (response.data && response.data.items) {
          // Logic merge giỏ hàng (có thể làm phức tạp hơn)
          this.items = response.data.items
          this.saveCart()
        }
      } catch (error) {
        console.error('Sync cart error:', error)
      }
    },
  }
})