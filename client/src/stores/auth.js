import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
async login(email, password) {
  try {
    const response = await axios.post('/api/auth/login', { email, password })
    this.token = response.data.token
    this.user = {
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
    }

    localStorage.setItem('token', this.token)
    localStorage.setItem('user', JSON.stringify(this.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

    // ✅ Gộp giỏ guest vào giỏ user (không ghi đè, không mất dữ liệu cũ)
    const { useCartStore } = await import('./cart')
    const cartStore = useCartStore()
    cartStore.mergeGuestCartIntoUser(this.user._id)
    cartStore.loadCart()

    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Đăng nhập thất bại' }
  }
},

    async register(name, email, password) {
      try {
        const response = await axios.post('/api/auth/register', { name, email, password })
        return { success: true, message: response.data.message }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Đăng ký thất bại' }
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        const response = await axios.get('/api/auth/me')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        this.logout()
      }
    },

    async logout() {
  this.user = null
  this.token = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete axios.defaults.headers.common['Authorization']
  // Load lại giỏ hàng guest (hoặc rỗng)
  const { useCartStore } = await import('./cart')
  const cartStore = useCartStore()
  cartStore.clearCartOnLogout()
  cartStore.loadCart()
}
  }
})