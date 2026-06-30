import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    pagination: { total: 0, page: 1, pages: 1, limit: 12 },
    loadingList: false,
    loadingAction: false,
    error: null,
  }),

  getters: {
    // ✅ Tìm theo _id (MongoDB) hoặc id (cũ)
    getProductById: (state) => (id) => {
      return state.products.find(p => p._id === id || p.id === id)
    },
  },

  actions: {
    // Lấy sản phẩm có phân trang (dùng cho trang khách /products)
    async fetchProducts(params = {}) {
      this.loadingList = true
      this.error = null
      try {
        const response = await axios.get('/api/products', { params })
        this.products = response.data.products
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = 'Không thể tải sản phẩm'
        console.error('❌ fetchProducts:', error)
      } finally {
        this.loadingList = false
      }
    },

    // ✅ Dành riêng cho trang Admin: luôn lấy TOÀN BỘ sản phẩm, không bị cắt phân trang
    async fetchAllProductsForAdmin() {
      this.loadingList = true
      this.error = null
      try {
        const response = await axios.get('/api/products', { params: { limit: 1000 } })
        this.products = response.data.products
        this.pagination = response.data.pagination
      } catch (error) {
        this.error = 'Không thể tải sản phẩm'
        console.error('❌ fetchAllProductsForAdmin:', error)
      } finally {
        this.loadingList = false
      }
    },

    // Lấy chi tiết 1 sản phẩm
    async fetchProductById(id) {
      this.loadingList = true
      this.error = null
      try {
        const response = await axios.get(`/api/products/${id}`)
        const product = response.data
        const index = this.products.findIndex(p => p._id === id || p.id === id)
        if (index !== -1) {
          this.products[index] = product
        } else {
          this.products.push(product)
        }
        return product
      } catch (error) {
        this.error = 'Không thể tải sản phẩm'
        return null
      } finally {
        this.loadingList = false
      }
    },

    // ✅ Thêm sản phẩm mới — gọi API thật
    async createProduct(productData) {
      this.loadingAction = true
      try {
        const response = await axios.post('/api/products', productData)
        await this.fetchAllProductsForAdmin() // reload đầy đủ, không bị cắt còn 12
        return { success: true, product: response.data }
      } catch (error) {
        console.error('❌ createProduct:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Thêm sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },

    // ✅ Cập nhật sản phẩm — gọi API thật
    async updateProduct(id, productData) {
      this.loadingAction = true
      try {
        const response = await axios.put(`/api/products/${id}`, productData)
        await this.fetchAllProductsForAdmin() // reload đầy đủ, không bị cắt còn 12
        return { success: true, product: response.data }
      } catch (error) {
        console.error('❌ updateProduct:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Cập nhật sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },

    // ✅ Xóa sản phẩm — gọi API thật
    async deleteProduct(id) {
      this.loadingAction = true
      try {
        await axios.delete(`/api/products/${id}`)
        await this.fetchAllProductsForAdmin() // reload đầy đủ, không bị cắt còn 12
        return { success: true }
      } catch (error) {
        console.error('❌ deleteProduct:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Xóa sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },
    async fetchAllCategoriesOnce() {
  try {
    const response = await axios.get('/api/products', { params: { limit: 1000 } })
    const cats = new Set(response.data.products.map(p => p.category))
    return [...cats]
  } catch (error) {
    console.error('❌ fetchAllCategoriesOnce:', error)
    return []
  }
}
  }
})