<template>
  <div class="pt-32 max-w-md mx-auto px-4">
    <h1 class="text-2xl font-bold text-light text-center mb-6">Quên mật khẩu</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input v-model="email" type="email" required placeholder="Nhập email đã đăng ký"
             class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none" />
      <button type="submit" :disabled="loading"
              class="bg-gold text-dark w-full py-3 rounded font-semibold disabled:opacity-50">
        {{ loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu' }}
      </button>
      <p v-if="message" class="text-green-400 text-sm text-center">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const res = await axios.post('/api/auth/forgot-password', { email: email.value })
    message.value = res.data.message
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    loading.value = false
  }
}
</script>