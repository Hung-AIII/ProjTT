<template>
  <div class="p-6 pt-24 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-light tracking-wider mb-6">⭐ Quản lý đánh giá</h1>
 
    <div v-if="loading" class="text-muted text-center italic py-10">Đang tải...</div>
    <div v-else-if="reviews.length === 0" class="text-muted text-center italic py-10">Chưa có đánh giá nào.</div>
 
    <div v-else class="space-y-4">
      <div v-for="r in visibleReviews" :key="r._id" class="bg-dark3/80 border border-white/5 rounded-lg p-5">
        <div class="flex items-center gap-3 mb-2">
          <img :src="r.productImage" class="w-12 h-12 object-cover rounded" />
          <div>
            <router-link :to="`/products/${r.productId}`" class="text-light font-semibold hover:text-gold transition">
              {{ r.productName }}
            </router-link>
            <p class="text-muted text-xs">{{ formatDate(r.createdAt) }}</p>
          </div>
        </div>
 
        <div class="flex justify-between items-center">
          <span class="text-light font-medium">{{ r.name }}</span>
          <span class="text-gold text-sm">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
        </div>
        <p class="text-muted text-sm mt-1">{{ r.comment }}</p>
 
        <!-- Đã trả lời -->
        <div v-if="r.adminReply" class="mt-3 ml-4 pl-4 border-l-2 border-gold/40 bg-gold/5 rounded p-3">
          <p class="text-gold text-xs font-semibold mb-1">🏪 Phản hồi của bạn</p>
          <p class="text-light text-sm">{{ r.adminReply }}</p>
        </div>
 
        <!-- Form trả lời -->
        <div v-if="replyingId === r._id" class="mt-3 flex gap-2">
          <input v-model="replyText" placeholder="Nhập phản hồi..."
                 class="flex-1 bg-dark2 border border-white/10 rounded-lg px-3 py-2 text-light text-sm focus:border-gold focus:outline-none" />
          <button @click="sendReply(r)" :disabled="sendingReply"
                  class="bg-gold text-dark px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
            Gửi
          </button>
          <button @click="replyingId = null" class="text-muted hover:text-light px-2 text-sm">Huỷ</button>
        </div>
 
        <div class="flex gap-3 mt-3">
          <button v-if="replyingId !== r._id" @click="openReply(r)"
                  class="text-gold text-xs hover:underline">
            {{ r.adminReply ? '✏ Sửa phản hồi' : '💬 Trả lời' }}
          </button>
          <button @click="removeReview(r)" class="text-red-500 text-xs hover:underline">✕ Xoá đánh giá</button>
        </div>
      </div>
 
      <!-- Nút xem tất cả / thu gọn -->
      <div v-if="reviews.length > REVIEW_LIMIT" class="text-center pt-2">
        <button @click="showAll = !showAll"
                class="text-gold text-sm font-semibold hover:underline">
          {{ showAll ? '▲ Thu gọn' : `▼ Xem tất cả (${reviews.length})` }}
        </button>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
 
const reviews = ref([])
const loading = ref(true)
const replyingId = ref(null)
const replyText = ref('')
const sendingReply = ref(false)
 
const REVIEW_LIMIT = 5
const showAll = ref(false)
 
const visibleReviews = computed(() =>
  showAll.value ? reviews.value : reviews.value.slice(0, REVIEW_LIMIT)
)
 
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}
 
const fetchReviews = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/products/reviews/all')
    reviews.value = res.data
  } catch (error) {
    console.error('❌ fetchReviews:', error)
  } finally {
    loading.value = false
  }
}
 
const openReply = (r) => {
  replyingId.value = r._id
  replyText.value = r.adminReply || ''
}
 
const sendReply = async (r) => {
  if (!replyText.value.trim()) return
  sendingReply.value = true
  try {
    await axios.put(`/api/products/${r.productId}/reviews/${r._id}/reply`, { reply: replyText.value })
    replyingId.value = null
    await fetchReviews()
  } catch (error) {
    alert(error.response?.data?.message || 'Trả lời thất bại')
  } finally {
    sendingReply.value = false
  }
}
 
const removeReview = async (r) => {
  if (!confirm('Bạn có chắc muốn xoá đánh giá này?')) return
  try {
    await axios.delete(`/api/products/${r.productId}/reviews/${r._id}`)
    await fetchReviews()
  } catch (error) {
    alert(error.response?.data?.message || 'Xoá thất bại')
  }
}
 
onMounted(fetchReviews)
</script>