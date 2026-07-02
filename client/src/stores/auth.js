import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  // ── State ──────────────────────────────────────────────────────
  const token = ref(Cookies.get('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user')) || null)

  // ── Watch: token thay đổi → tự động đồng bộ cookie + header ───
  watch(
    token,
    (newToken) => {
      if (newToken) {
        Cookies.set('token', newToken, { expires: 30, sameSite: 'Strict' })
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      } else {
        Cookies.remove('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },
    { immediate: true }
  )

  // ── Getters — dùng computed để reactive đúng ───────────────────
  // ❌ Bản cũ: const isLoggedIn = () => !!token.value  → hàm, luôn truthy
  // ✅ Bản mới: computed → trả về boolean reactive
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  // ── Actions ────────────────────────────────────────────────────
  async function login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', { email, password })

      token.value = response.data.token
      user.value  = {
        _id:   response.data._id,
        name:  response.data.name,
        email: response.data.email,
        role:  response.data.role,
      }
      localStorage.setItem('user', JSON.stringify(user.value))

      const { useCartStore } = await import('./cart')
      const cartStore = useCartStore()
      cartStore.mergeGuestCartIntoUser(user.value._id)
      cartStore.loadCart()

      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Đăng nhập thất bại' }
    }
  }

  async function register(name, email, password) {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Đăng ký thất bại' }
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await axios.get('/api/auth/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch {
      logout()
    }
  }

  async function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('user')
    localStorage.removeItem('cart')

    const { useCartStore } = await import('./cart')
    const cartStore = useCartStore()
    cartStore.clearCartOnLogout()
    cartStore.loadCart()
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    login,
    register,
    fetchUser,
    logout,
  }
})