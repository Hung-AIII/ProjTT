<template>
  <div class="min-h-screen flex items-center justify-center pt-20 px-4">
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg w-full max-w-md p-8">
      <h2 class="text-3xl font-bold text-center text-light tracking-wider">{{ isLogin ? '🔐 Đăng nhập' : '📝 Đăng ký' }}</h2>
      <p class="text-muted text-center italic mt-1">{{ isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới' }}</p>
      
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div v-if="!isLogin">
          <label class="block text-light text-sm font-semibold tracking-wide mb-1">Họ tên</label>
          <input type="text" v-model="name" placeholder="Nhập họ tên" required
                 class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label class="block text-light text-sm font-semibold tracking-wide mb-1">Email</label>
          <input type="email" v-model="email" placeholder="Nhập email" required
                 class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label class="block text-light text-sm font-semibold tracking-wide mb-1">Mật khẩu</label>
          <input type="password" v-model="password" placeholder="Nhập mật khẩu" required
                 class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
        </div>
        <button type="submit" class="bg-gold text-dark w-full py-3 rounded hover:bg-goldHover transition-all font-semibold tracking-wider" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản') }}
        </button>
        <p v-if="error" class="text-red-500 text-center italic">{{ error }}</p>
        <p v-if="success" class="text-gold text-center italic">{{ success }}</p>
      </form>

      <p class="text-center text-muted mt-4">
        {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
        <a href="#" @click.prevent="toggleMode" class="text-gold font-bold hover:underline">
          {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  success.value = ''
  name.value = ''
  email.value = ''
  password.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    if (isLogin.value) {
      const result = await authStore.login(email.value, password.value)
      if (result.success) router.push('/')
      else error.value = result.message
    } else {
      const result = await authStore.register(name.value, email.value, password.value)
      if (result.success) {
        success.value = 'Đăng ký thành công! Vui lòng đăng nhập.'
        setTimeout(() => {
          isLogin.value = true
          success.value = ''
          name.value = ''
          email.value = ''
          password.value = ''
        }, 2000)
      } else error.value = result.message
    }
  } catch {
    error.value = 'Có lỗi xảy ra, thử lại nhé.'
  } finally {
    loading.value = false
  }
}
</script>