<template>
  <div class="pt-20 max-w-3xl mx-auto px-4">
    <router-link :to="`/products/${productId}`" class="text-muted hover:text-gold transition text-sm italic">
      ← Quay lại sản phẩm
    </router-link>

    <div v-if="product" class="mt-4">
      <div class="flex items-center gap-4 bg-dark3/80 border border-white/5 rounded-lg p-4">
        <img :src="product.image" class="w-16 h-16 object-cover rounded" />
        <div>
          <h1 class="text-light font-bold">{{ product.name }}</h1>
          <p class="text-gold text-sm">
            ⭐ {{ product.averageRating?.toFixed(1) || 0 }}/5 · {{ product.numReviews || 0 }} đánh giá
          </p>
        </div>
      </div>

      <!-- Danh sách đánh giá -->
      <div class="mt-6 space-y-4">
        <div v-if="!product.reviews?.length" class="text-muted italic text-center py-10">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
        <div v-for="r in product.reviews" :key="r._id" class="border border-white/5 rounded-lg p-4 bg-dark3/50">
          <div class="flex justify-between items-center mb-1">
            <span class="text-light font-medium">{{ r.name }}</span>
            <span class="text-gold text-sm">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
          </div>
          <p class="text-muted text-sm">{{ r.comment }}</p>

          <!-- Phản hồi từ shop -->
          <div v-if="r.adminReply" class="mt-3 ml-4 pl-4 border-l-2 border-gold/40 bg-gold/5 rounded p-3">
            <p class="text-gold text-xs font-semibold mb-1">🏪 Phản hồi từ Hùng Hà Shop</p>
            <p class="text-light text-sm">{{ r.adminReply }}</p>
          </div>
        </div>
      </div>

      <!-- Form gửi đánh giá mới -->
      <div class="mt-10 border-t border-white/10 pt-6">
        <h2 class="text-light font-semibold mb-3">Viết đánh giá của bạn</h2>
        <form v-if="authStore.isLoggedIn" @submit.prevent="submitReview" class="space-y-3">
          <select v-model="reviewForm.rating" required
                  class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light">
            <option value="">Chọn số sao</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
          </select>
          <textarea v-model="reviewForm.comment" required rows="3" placeholder="Nhận xét của bạn..."
                    class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light"></textarea>
          <button type="submit" :disabled="reviewLoading"
                  class="bg-gold text-dark px-6 py-2 rounded font-semibold disabled:opacity-50">
            {{ reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
          <p v-if="reviewError" class="text-red-500 text-sm">{{ reviewError }}</p>
        </form>
        <p v-else class="text-muted text-sm">
          <router-link to="/login" class="text-gold hover:underline">Đăng nhập</router-link> để viết đánh giá.
        </p>
      </div>
    </div>

    <div v-else-if="loading" class="text-muted text-center py-20 italic">Đang tải...</div>
    <div v-else class="text-muted text-center py-20 italic">Không tìm thấy sản phẩm.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const route = useRoute()
const authStore = useAuthStore()

const productId = route.params.id
const product = ref(null)
const loading = ref(true)

const reviewForm = ref({ rating: '', comment: '' })
const reviewLoading = ref(false)
const reviewError = ref('')

const fetchProduct = async () => {
  try {
    const res = await axios.get(`/api/products/${productId}`)
    product.value = res.data
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

const submitReview = async () => {
  reviewError.value = ''
  reviewLoading.value = true
  try {
    await axios.post(`/api/products/${productId}/reviews`, reviewForm.value)
    reviewForm.value = { rating: '', comment: '' }
    await fetchProduct()
  } catch (error) {
    reviewError.value = error.response?.data?.message || 'Gửi đánh giá thất bại'
  } finally {
    reviewLoading.value = false
  }
}

onMounted(fetchProduct)
</script>