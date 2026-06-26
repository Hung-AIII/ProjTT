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
      return state.orders.find(order => order._id === id)
    },
  },

  actions: {
    // User: lấy đơn hàng của mình
    async fetchMyOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/orders/me')
        this.orders = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải đơn hàng'
      } finally {
        this.loading = false
      }
    },

    // Admin: lấy tất cả đơn
    async fetchAllOrders() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/orders')
        this.orders = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải đơn hàng'
      } finally {
        this.loading = false
      }
    },

    // Tạo đơn hàng mới
    async createOrder(orderData) {
      try {
        const response = await axios.post('/api/orders', orderData)
        await this.fetchMyOrders()
        return { success: true, order: response.data }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Đặt hàng thất bại' }
      }
    },

    // Admin: cập nhật trạng thái
    async updateOrderStatus(id, status) {
      try {
        const response = await axios.put(`/api/orders/${id}/status`, { status })
        // Cập nhật ngay trong store không cần fetch lại
        const order = this.orders.find(o => o._id === id)
        if (order) {
          order.status = status
          if (status === 'delivered') {
            order.isPaid = true
            order.paidAt = new Date().toISOString()
          }
          if (status === 'cancelled') {
            order.isPaid = false
            order.paidAt = null
          }
        }
        return { success: true, order: response.data }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Cập nhật thất bại' }
      }
    },
  }
})