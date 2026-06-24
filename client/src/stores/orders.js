import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),

  getters: {
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === id)
    },
  },

  actions: {
    // Lấy đơn hàng của user hiện tại
    async fetchMyOrders() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/orders/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.orders = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải đơn hàng'
        console.error('Fetch orders error:', error)
      } finally {
        this.loading = false
      }
    },

    // Admin: Lấy tất cả đơn hàng
    async fetchAllOrders() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.orders = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải đơn hàng'
        console.error('Fetch all orders error:', error)
      } finally {
        this.loading = false
      }
    },

    // Tạo đơn hàng mới
    async createOrder(orderData) {
      try {
        const token = localStorage.getItem('token')
        console.log('🔑 Token gửi đi:', token) // Kiểm tra token
        
        const response = await axios.post('/api/orders', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchMyOrders()
        return { success: true, order: response.data }
      } catch (error) {
        console.error('❌ Lỗi đặt hàng:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Đặt hàng thất bại' }
      }
    },

    // Admin: Cập nhật trạng thái đơn hàng
    async updateOrderStatus(id, status) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`/api/orders/${id}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await this.fetchAllOrders()
        return { success: true, order: response.data }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Cập nhật trạng thái thất bại' }
      }
    },
  }
})