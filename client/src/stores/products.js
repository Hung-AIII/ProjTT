import { defineStore } from 'pinia'
import axios from 'axios'
 
// Tự động đính kèm token vào mọi request — không cần lấy thủ công trong từng action

 
export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loadingList: false,   // loading cho fetchProducts / fetchProductById
    loadingAction: false, // loading cho create / update / delete
    error: null,
  }),
 
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => 
        product._id === id || product.id === id
      )
    },
  },
  actions: {
    async fetchProducts() {
      this.loadingList = true
      this.error = null
      try {
        const response = await axios.get('/api/products', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        this.products = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải sản phẩm'
        console.error('❌ Lỗi fetch products:', error)
      } finally {
        this.loadingList = false
      }
    },
 
    async fetchProductById(id) {
      this.loadingList = true
      this.error = null
      try {
        const response = await axios.get(`/api/products/${id}`)
        // Cập nhật vào store để getProductById getter có thể tìm thấy
        const index = this.products.findIndex(p => p._id === id || p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        } else {
          this.products.push(response.data)
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể tải sản phẩm'
        return null
      } finally {
        this.loadingList = false
      }
    },
 
    async createProduct(productData) {
      this.loadingAction = true
      try {
        const response = await axios.post('/api/products', productData)
        await this.fetchProducts()
        return { success: true, product: response.data }
      } catch (error) {
        console.error('❌ Lỗi create:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Thêm sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },
 
    async updateProduct(id, productData) {
      this.loadingAction = true
      try {
        const response = await axios.put(`/api/products/${id}`, productData)
        await this.fetchProducts()
        return { success: true, product: response.data }
      } catch (error) {
        console.error('❌ Lỗi update:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Cập nhật sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },
 
    async deleteProduct(id) {
      this.loadingAction = true
      try {
        await axios.delete(`/api/products/${id}`)
        await this.fetchProducts()
        return { success: true }
      } catch (error) {
        console.error('❌ Lỗi delete:', error.response?.data)
        return { success: false, message: error.response?.data?.message || 'Xóa sản phẩm thất bại' }
      } finally {
        this.loadingAction = false
      }
    },
  }
})