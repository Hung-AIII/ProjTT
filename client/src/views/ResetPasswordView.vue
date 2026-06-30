<template>
  <div class="pt-32 max-w-md mx-auto px-4">
    <h1 class="text-2xl font-bold text-light text-center mb-6">Đặt lại mật khẩu</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input v-model="password" type="password" required placeholder="Mật khẩu mới"
             class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none" />
      <input v-model="confirmPassword" type="password" required placeholder="Xác nhận mật khẩu mới"
             class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none" />
      <button type="submit" :disabled="loading"
              class="bg-gold text-dark w-full py-3 rounded font-semibold disabled:opacity-50">
        {{ loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu' }}
      </button>
      <p v-if="message" class="text-green-400 text-sm text-center">{{ message }}</p>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  loading.value = true
  try {
    const res = await axios.put(`/api/auth/reset-password/${route.params.token}`, {
      password: password.value,
    })
    message.value = res.data.message
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    loading.value = false
  }
}
</script>