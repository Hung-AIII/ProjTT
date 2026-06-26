<template>
  <div class="pt-20 max-w-4xl mx-auto px-6 pb-12">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase text-light">👤 Tài khoản của tôi</h1>

    <div class="grid md:grid-cols-3 gap-6 mt-8">

      <!-- Sidebar -->
      <div class="md:col-span-1">
        <div class="bg-dark3/80 border border-white/5 rounded-lg p-6 text-center">
          <div class="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold mx-auto flex items-center justify-center text-3xl">
            {{ authStore.user?.name?.charAt(0).toUpperCase() || '?' }}
          </div>
          <p class="text-light font-bold text-lg mt-3">{{ authStore.user?.name }}</p>
          <p class="text-muted text-sm">{{ authStore.user?.email }}</p>
          <span class="text-xs px-3 py-1 rounded-full mt-2 inline-block"
                :class="authStore.isAdmin ? 'bg-gold/20 text-gold' : 'bg-white/10 text-muted'">
            {{ authStore.isAdmin ? '⭐ Admin' : '👤 Thành viên' }}
          </span>
        </div>

        <!-- Menu -->
        <div class="bg-dark3/80 border border-white/5 rounded-lg mt-4 overflow-hidden">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id
              ? 'bg-gold/10 text-gold border-l-2 border-gold'
              : 'text-muted hover:text-light hover:bg-white/5'"
            class="w-full text-left px-4 py-3 transition text-sm font-medium">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Nội dung -->
      <div class="md:col-span-2">

        <!-- Tab: Thông tin cá nhân -->
        <div v-if="activeTab === 'info'" class="bg-dark3/80 border border-white/5 rounded-lg p-6">
          <h2 class="text-xl font-bold text-light mb-4">📋 Thông tin cá nhân</h2>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-muted text-sm font-semibold mb-1">Họ tên</label>
              <input type="text" v-model="profileForm.name" required
                     class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label class="block text-muted text-sm font-semibold mb-1">Email</label>
              <input type="email" :value="authStore.user?.email" disabled
                     class="w-full bg-dark2 border border-white/5 rounded-lg px-4 py-2 text-muted cursor-not-allowed" />
              <p class="text-muted text-xs mt-1">Email không thể thay đổi</p>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="profileLoading"
                      class="bg-gold text-dark px-6 py-2 rounded hover:bg-goldHover transition font-semibold disabled:opacity-50">
                {{ profileLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
            <p v-if="profileSuccess" class="text-green-400 text-sm">✅ {{ profileSuccess }}</p>
            <p v-if="profileError" class="text-red-500 text-sm">❌ {{ profileError }}</p>
          </form>
        </div>

        <!-- Tab: Đổi mật khẩu -->
        <div v-if="activeTab === 'password'" class="bg-dark3/80 border border-white/5 rounded-lg p-6">
          <h2 class="text-xl font-bold text-light mb-4">🔐 Đổi mật khẩu</h2>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-muted text-sm font-semibold mb-1">Mật khẩu hiện tại</label>
              <input type="password" v-model="passwordForm.current" required placeholder="Nhập mật khẩu hiện tại"
                     class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label class="block text-muted text-sm font-semibold mb-1">Mật khẩu mới</label>
              <input type="password" v-model="passwordForm.new" required placeholder="Tối thiểu 6 ký tự"
                     minlength="6"
                     class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label class="block text-muted text-sm font-semibold mb-1">Xác nhận mật khẩu mới</label>
              <input type="password" v-model="passwordForm.confirm" required placeholder="Nhập lại mật khẩu mới"
                     class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
            </div>
            <!-- Strength indicator -->
            <div v-if="passwordForm.new" class="space-y-1">
              <p class="text-muted text-xs">Độ mạnh mật khẩu:</p>
              <div class="flex gap-1">
                <div v-for="i in 4" :key="i"
                     class="h-1 flex-1 rounded"
                     :class="passwordStrength >= i ? strengthColor : 'bg-white/10'"></div>
              </div>
              <p class="text-xs" :class="strengthTextColor">{{ strengthText }}</p>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="pwLoading"
                      class="bg-gold text-dark px-6 py-2 rounded hover:bg-goldHover transition font-semibold disabled:opacity-50">
                {{ pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu' }}
              </button>
            </div>
            <p v-if="pwSuccess" class="text-green-400 text-sm">✅ {{ pwSuccess }}</p>
            <p v-if="pwError" class="text-red-500 text-sm">❌ {{ pwError }}</p>
          </form>
        </div>

        <!-- Tab: Lịch sử đơn hàng (tóm tắt) -->
        <div v-if="activeTab === 'orders'" class="bg-dark3/80 border border-white/5 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-light">📦 Đơn hàng gần đây</h2>
            <router-link to="/orders" class="text-gold text-sm hover:text-goldHover transition">
              Xem tất cả →
            </router-link>
          </div>
          <div v-if="ordersStore.loading" class="text-muted text-center py-8 italic">Đang tải...</div>
          <div v-else-if="ordersStore.orders.length > 0" class="space-y-3">
            <div v-for="order in ordersStore.orders.slice(0, 5)" :key="order._id"
                 class="border border-white/5 rounded-lg p-4 hover:border-gold/20 transition">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-muted text-xs">Mã đơn: #{{ order._id?.slice(-6) }}</p>
                  <p class="text-light text-sm font-medium mt-1">
                    {{ order.items?.[0]?.name }}
                    <span v-if="order.items?.length > 1" class="text-muted">+{{ order.items.length - 1 }} món</span>
                  </p>
                  <p class="text-muted text-xs mt-1">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gold font-bold">{{ formatPrice(order.totalPrice) }}</p>
                  <span :class="statusClass(order.status)" class="text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                    {{ statusText(order.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-muted italic">Chưa có đơn hàng nào</p>
            <router-link to="/products" class="text-gold text-sm hover:text-goldHover transition mt-2 inline-block">
              Mua ngay →
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import axios from 'axios'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const activeTab = ref('info')

const tabs = [
  { id: 'info', icon: '📋', label: 'Thông tin cá nhân' },
  { id: 'password', icon: '🔐', label: 'Đổi mật khẩu' },
  { id: 'orders', icon: '📦', label: 'Đơn hàng của tôi' },
]

// ===== THÔNG TIN CÁ NHÂN =====
const profileForm = ref({ name: authStore.user?.name || '' })
const profileLoading = ref(false)
const profileSuccess = ref('')
const profileError = ref('')

const updateProfile = async () => {
  profileLoading.value = true
  profileSuccess.value = ''
  profileError.value = ''
  try {
    const response = await axios.put('/api/auth/profile', {
      name: profileForm.value.name
    })
    // Cập nhật store
    authStore.user.name = response.data.name
    localStorage.setItem('user', JSON.stringify(authStore.user))
    profileSuccess.value = 'Cập nhật thành công!'
    setTimeout(() => profileSuccess.value = '', 3000)
  } catch (error) {
    profileError.value = error.response?.data?.message || 'Cập nhật thất bại'
  } finally {
    profileLoading.value = false
  }
}

// ===== ĐỔI MẬT KHẨU =====
const passwordForm = ref({ current: '', new: '', confirm: '' })
const pwLoading = ref(false)
const pwSuccess = ref('')
const pwError = ref('')

// Đánh giá độ mạnh mật khẩu
const passwordStrength = computed(() => {
  const pw = passwordForm.value.new
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const strengthColor = computed(() => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  return colors[passwordStrength.value - 1] || 'bg-red-500'
})

const strengthText = computed(() => {
  const texts = ['Yếu', 'Trung bình', 'Khá', 'Mạnh']
  return texts[passwordStrength.value - 1] || 'Yếu'
})

const strengthTextColor = computed(() => {
  const colors = ['text-red-500', 'text-orange-400', 'text-yellow-400', 'text-green-400']
  return colors[passwordStrength.value - 1] || 'text-red-500'
})

const changePassword = async () => {
  pwError.value = ''
  pwSuccess.value = ''

  if (passwordForm.value.new !== passwordForm.value.confirm) {
    pwError.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  if (passwordForm.value.new.length < 6) {
    pwError.value = 'Mật khẩu mới tối thiểu 6 ký tự'
    return
  }

  pwLoading.value = true
  try {
    await axios.put('/api/auth/change-password', {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.new,
    })
    pwSuccess.value = 'Đổi mật khẩu thành công!'
    passwordForm.value = { current: '', new: '', confirm: '' }
    setTimeout(() => pwSuccess.value = '', 3000)
  } catch (error) {
    pwError.value = error.response?.data?.message || 'Đổi mật khẩu thất bại'
  } finally {
    pwLoading.value = false
  }
}

// ===== FORMAT =====
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

const statusText = (status) => {
  const map = { pending: '⏳ Đang xử lý', processing: '🔄 Chuẩn bị', shipped: '🚚 Đang giao', delivered: '✅ Đã giao', cancelled: '❌ Đã hủy' }
  return map[status] || status
}

const statusClass = (status) => {
  const map = { pending: 'bg-yellow-500/20 text-yellow-500', processing: 'bg-blue-500/20 text-blue-400', shipped: 'bg-purple-500/20 text-purple-400', delivered: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-500' }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

onMounted(() => {
  ordersStore.fetchMyOrders()
})
</script>