import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    // ✅ Thêm vào giỏ — kiểm tra stock
    addToCart(product, quantity = 1) {
      const productId = product._id || product.id
      const stock = product.stock ?? 999  // nếu không có stock thì không giới hạn

      const existingItem = this.items.find(item => item.id === productId)

      if (existingItem) {
        // Kiểm tra không vượt stock
        const newQty = existingItem.quantity + quantity
        if (newQty > stock) {
          alert(`Chỉ còn ${stock} sản phẩm trong kho!`)
          existingItem.quantity = stock  // giới hạn tại stock
        } else {
          existingItem.quantity = newQty
        }
      } else {
        if (quantity > stock) {
          alert(`Chỉ còn ${stock} sản phẩm trong kho!`)
          quantity = stock
        }
        this.items.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock,  // ✅ Lưu stock để kiểm tra khi tăng số lượng
        })
      }
      this.saveCart()
    },

    // ✅ Cập nhật số lượng — kiểm tra stock
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (!item) return

      if (quantity <= 0) {
        this.removeFromCart(productId)
        return
      }

      // Kiểm tra không vượt stock
      const maxQty = item.stock ?? 999
      if (quantity > maxQty) {
        alert(`Chỉ còn ${maxQty} sản phẩm trong kho!`)
        item.quantity = maxQty
      } else {
        item.quantity = quantity
      }
      this.saveCart()
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
  }
})