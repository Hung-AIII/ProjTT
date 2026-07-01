<template>
  <div class="pt-20 max-w-3xl mx-auto px-4 pb-16">
    <router-link :to="`/products/${productId}`"
                 class="inline-flex items-center gap-2 text-muted hover:text-gold transition text-sm italic mb-6">
      ← Quay lại sản phẩm
    </router-link>

    <div v-if="product">
      <!-- Header sản phẩm -->
      <div class="flex items-center gap-4 bg-dark3/80 border border-white/5 rounded-xl p-4 mb-8">
        <img :src="product.image" class="w-16 h-16 object-cover rounded-lg" />
        <div>
          <p class="text-muted text-xs uppercase tracking-widest mb-0.5">Sản phẩm</p>
          <h1 class="text-light font-bold text-lg">{{ product.name }}</h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-gold font-bold">{{ product.averageRating?.toFixed(1) || '0.0' }}</span>
            <span class="text-gold text-sm">{{ renderStars(product.averageRating || 0) }}</span>
            <span class="text-muted text-xs">· {{ product.numReviews || 0 }} đánh giá</span>
          </div>
        </div>
      </div>

      <!-- Bộ lọc theo sao -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <span class="text-muted text-sm mr-1">Lọc:</span>
        <button
          v-for="star in [0, 5, 4, 3, 2, 1]" :key="star"
          @click="filterStar = star"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition border',
            filterStar === star
              ? 'bg-gold text-dark border-gold'
              : 'border-white/10 text-muted hover:border-gold/50 hover:text-light'
          ]"
        >
          {{ star === 0 ? 'Tất cả' : `${'★'.repeat(star)} ${star} sao` }}
          <span class="text-xs opacity-70">({{ star === 0 ? product.reviews?.length || 0 : countByStar(star) }})</span>
        </button>
      </div>

      <!-- Danh sách đánh giá -->
      <div class="space-y-4">
        <div v-if="!filteredReviews.length" class="text-muted italic text-center py-10 bg-dark3/40 rounded-xl border border-white/5">
          {{ filterStar === 0 ? 'Chưa có đánh giá nào.' : `Không có đánh giá ${filterStar} sao nào.` }}
        </div>

        <TransitionGroup name="review" tag="div" class="space-y-4">
          <div v-for="r in visibleReviews" :key="r._id"
               class="border border-white/5 rounded-xl p-5 bg-dark3/50 hover:border-white/10 transition">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
                  {{ r.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-light font-medium text-sm">{{ r.name }}</p>
                  <p class="text-muted text-xs">{{ formatDate(r.createdAt) }}</p>
                </div>
              </div>
              <span class="text-gold text-sm">{{ '★'.repeat(r.rating) }}<span class="text-white/20">{{ '★'.repeat(5 - r.rating) }}</span></span>
            </div>
            <p class="text-muted text-sm mt-3 leading-relaxed">{{ r.comment }}</p>

            <!-- Phản hồi từ shop -->
            <div v-if="r.adminReply" class="mt-4 ml-4 pl-4 border-l-2 border-gold/40 bg-gold/5 rounded-r-lg p-3">
              <p class="text-gold text-xs font-semibold mb-1 tracking-wider uppercase">🏪 Hùng Hà Shop phản hồi</p>
              <p class="text-light text-sm leading-relaxed">{{ r.adminReply }}</p>
            </div>
          </div>
        </TransitionGroup>

        <!-- Nút Xem thêm / Thu gọn -->
        <div v-if="filteredReviews.length > 5" class="text-center pt-2">
          <button @click="showAll = !showAll"
                  class="inline-flex items-center gap-2 border border-gold/40 text-gold hover:bg-gold hover:text-dark px-6 py-2.5 rounded-full text-sm font-semibold transition">
            <span>{{ showAll ? 'Thu gọn ▲' : `Xem thêm ${filteredReviews.length - 5} đánh giá ▼` }}</span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/5 my-10"></div>

      <!-- Form gửi đánh giá -->
      <div>
        <h2 class="text-xl font-bold text-light mb-4">✍ Viết đánh giá của bạn</h2>

        <form v-if="authStore.isLoggedIn && !authStore.isAdmin" @submit.prevent="submitReview" class="space-y-4">
          <!-- Chọn sao bằng cách bấm trực tiếp -->
          <div>
            <label class="block text-muted text-sm mb-2">Đánh giá</label>
            <div class="flex gap-2">
              <button v-for="n in 5" :key="n" type="button" @click="reviewForm.rating = n"
                      :class="[
                        'w-10 h-10 rounded-full text-xl transition',
                        n <= reviewForm.rating ? 'text-gold' : 'text-white/20 hover:text-gold/50'
                      ]">★</button>
            </div>
          </div>
          <div>
            <label class="block text-muted text-sm mb-2">Nhận xét</label>
            <textarea v-model="reviewForm.comment" required rows="4" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                      class="w-full bg-dark2 border border-white/10 rounded-xl px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none transition resize-none"></textarea>
          </div>
          <button type="submit" :disabled="reviewLoading || !reviewForm.rating"
                  class="bg-gold text-dark px-8 py-3 rounded-full font-semibold disabled:opacity-50 hover:bg-goldHover transition">
            {{ reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
          <p v-if="reviewError" class="text-red-500 text-sm">{{ reviewError }}</p>
          <p v-if="reviewSuccess" class="text-green-400 text-sm">{{ reviewSuccess }}</p>
        </form>

        <p v-else-if="!authStore.isLoggedIn" class="text-muted text-sm">
          <router-link to="/login" class="text-gold hover:underline">Đăng nhập</router-link> để viết đánh giá.
        </p>
        <p v-else class="text-muted text-sm italic">Admin không thể gửi đánh giá.</p>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-24">
      <div class="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
    </div>
    <div v-else class="text-muted text-center py-20 italic">Không tìm thấy sản phẩm.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const route = useRoute()
const authStore = useAuthStore()
const productId = route.params.id

const product = ref(null)
const loading = ref(true)
const filterStar = ref(0)
const showAll = ref(false)

const reviewForm = ref({ rating: 0, comment: '' })
const reviewLoading = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')

const renderStars = (rating) => {
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

const countByStar = (star) => {
  return product.value?.reviews?.filter(r => r.rating === star).length || 0
}

// Danh sách review đã lọc theo sao
const filteredReviews = computed(() => {
  if (!product.value?.reviews) return []
  const sorted = [...product.value.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (filterStar.value === 0) return sorted
  return sorted.filter(r => r.rating === filterStar.value)
})

// Chỉ hiển thị 5 cái đầu, trừ khi bấm "Xem thêm"
const visibleReviews = computed(() => {
  if (showAll.value) return filteredReviews.value
  return filteredReviews.value.slice(0, 5)
})

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
  if (!reviewForm.value.rating) {
    reviewError.value = 'Vui lòng chọn số sao'
    return
  }
  reviewError.value = ''
  reviewSuccess.value = ''
  reviewLoading.value = true
  try {
    await axios.post(`/api/products/${productId}/reviews`, reviewForm.value)
    reviewForm.value = { rating: 0, comment: '' }
    reviewSuccess.value = '✅ Đã gửi đánh giá thành công!'
    await fetchProduct()
    setTimeout(() => { reviewSuccess.value = '' }, 3000)
  } catch (error) {
    reviewError.value = error.response?.data?.message || 'Gửi đánh giá thất bại'
  } finally {
    reviewLoading.value = false
  }
}

// Reset showAll khi đổi bộ lọc sao
const resetShow = () => { showAll.value = false }
import { watch } from 'vue'
watch(filterStar, resetShow)

onMounted(fetchProduct)
</script>

<style scoped>
.review-enter-active { transition: all 0.3s ease; }
.review-enter-from { opacity: 0; transform: translateY(10px); }
</style>