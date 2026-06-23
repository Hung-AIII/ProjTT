<template>
  <div class="login-page">
    <div class="auth-container glass-card">
      <h2>{{ isLogin ? '🔐 Đăng nhập' : '📝 Đăng ký' }}</h2>
      <p class="auth-sub">{{ isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới' }}</p>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isLogin" class="form-group">
          <label>Họ tên</label>
          <input type="text" v-model="name" placeholder="Nhập họ tên" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Nhập email" required />
        </div>
        <div class="form-group">
          <label>Mật khẩu</label>
          <input type="password" v-model="password" placeholder="Nhập mật khẩu" required />
        </div>
        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản') }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>

      <p class="toggle-mode">
        {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
        <a href="#" @click.prevent="toggleMode">
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
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.message
      }
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
      } else {
        error.value = result.message
      }
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra, thử lại nhé.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}
.auth-container {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(16px);
  padding: 48px 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 248, 240, 0.06);
  max-width: 420px;
  width: 100%;
}
.auth-container h2 {
  text-align: center;
  color: var(--text-light);
  font-size: 28px;
  letter-spacing: 2px;
  font-weight: 700;
}
.auth-sub {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  font-style: italic;
  margin-bottom: 28px;
  letter-spacing: 1px;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-light);
  font-size: 14px;
  letter-spacing: 1px;
}
.btn-full {
  width: 100%;
  margin-top: 6px;
}
.error {
  color: #c0392b;
  text-align: center;
  margin-top: 14px;
  font-style: italic;
}
.success {
  color: var(--accent);
  text-align: center;
  margin-top: 14px;
  font-style: italic;
}
.toggle-mode {
  text-align: center;
  margin-top: 20px;
  color: var(--text-muted);
  font-size: 14px;
}
.toggle-mode a {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
}
.toggle-mode a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}
</style>