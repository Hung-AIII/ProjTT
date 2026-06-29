import { defineStore } from 'pinia'

const getCartKey = () => {
  const user = localStorage.getItem('user')
  const userId = user ? JSON.parse(user)._id : null
  return userId ? `cart_${userId}` : 'cart_guest'
}

// Đọc JSON an toàn — nếu lỗi hoặc rỗng thì trả về mảng rỗng, không bao giờ crash app
const safeParseCart = (raw) => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: safeParseCart(localStorage.getItem(getCartKey())),
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    // Load lại cart theo đúng user hiện tại (gọi khi login/logout/F5)
    loadCart() {
      this.items = safeParseCart(localStorage.getItem(getCartKey()))
    },

    // Reset cart trong RAM (KHÔNG xoá dữ liệu trong localStorage)
    clearCartOnLogout() {
      this.items = []
    },

    // ✅ Gộp giỏ guest vào giỏ user khi đăng nhập — không ghi đè, không mất dữ liệu
    mergeGuestCartIntoUser(userId) {
      const guestItems = safeParseCart(localStorage.getItem('cart_guest'))
      if (guestItems.length === 0) {
        localStorage.removeItem('cart_guest')
        return
      }

      const userCartKey = `cart_${userId}`
      const userItems = safeParseCart(localStorage.getItem(userCartKey))

      // Gộp theo id sản phẩm, cộng số lượng nếu trùng
      guestItems.forEach((guestItem) => {
        const existing = userItems.find((i) => i.id === guestItem.id)
        if (existing) {
          const maxQty = existing.stock ?? 999
          existing.quantity = Math.min(existing.quantity + guestItem.quantity, maxQty)
        } else {
          userItems.push(guestItem)
        }
      })

      localStorage.setItem(userCartKey, JSON.stringify(userItems))
      localStorage.removeItem('cart_guest')
    },

    addToCart(product, quantity = 1) {
      const productId = product._id || product.id
      const stock = product.stock ?? 999
      const existingItem = this.items.find((item) => item.id === productId)

      if (existingItem) {
        const newQty = existingItem.quantity + quantity
        if (newQty > stock) {
          alert(`Chỉ còn ${stock} sản phẩm trong kho!`)
          existingItem.quantity = stock
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
          stock,
        })
      }
      this.saveCart()
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId)
      if (!item) return

      if (quantity <= 0) {
        this.removeFromCart(productId)
        return
      }

      const maxQty = item.stock ?? 999
      item.quantity = Math.min(quantity, maxQty)
      if (quantity > maxQty) alert(`Chỉ còn ${maxQty} sản phẩm trong kho!`)

      this.saveCart()
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveCart()
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem(getCartKey(), JSON.stringify(this.items))
    },
  },
})