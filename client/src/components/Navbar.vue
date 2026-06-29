<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-lg border-b border-white/5">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-1">
        <span class="text-gold text-2xl">✦</span>
        <span class="text-light text-2xl font-bold tracking-[0.2em]">HÙNG HÀ</span>
        <span class="text-gold text-3xl">.</span>
      </router-link>

      <!-- Nav links -->
      <div class="hidden md:flex items-center gap-8">
        <router-link to="/" class="text-muted hover:text-light transition tracking-wider">Trang chủ</router-link>
        <router-link to="/products" class="text-muted hover:text-light transition tracking-wider">Sản phẩm</router-link>

        <!-- ✅ Chỉ hiện link Liên hệ khi KHÔNG phải admin -->
        <router-link v-if="!authStore.isAdmin" to="/contact" class="text-muted hover:text-light transition tracking-wider">Liên hệ</router-link>

        <!-- 🔥 Lịch sử đơn hàng - hiển thị cho mọi user đã đăng nhập -->
        <router-link v-if="authStore.isLoggedIn && !authStore.isAdmin" to="/orders" class="text-muted hover:text-light transition tracking-wider">
          📋 Lịch sử đơn hàng
        </router-link>

        <!-- ✅ Admin: gom hết vào 1 dropdown "Quản lý" cho gọn -->
        <div v-if="authStore.isAdmin" class="relative" ref="adminMenuRef">
          <button @click="showAdminMenu = !showAdminMenu"
                  class="text-gold hover:text-goldHover transition tracking-wider flex items-center gap-1">
            ⚙ Quản lý
            <span class="text-xs transition-transform" :class="{ 'rotate-180': showAdminMenu }">▾</span>
          </button>

          <div v-if="showAdminMenu"
               class="absolute top-full right-0 mt-2 w-48 bg-dark2 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
            <router-link to="/admin" @click="showAdminMenu = false"
                         class="block px-4 py-2.5 text-light hover:bg-gold/10 hover:text-gold transition text-sm">📊 Tổng quan</router-link>
            <router-link to="/admin/products" @click="showAdminMenu = false"
                         class="block px-4 py-2.5 text-light hover:bg-gold/10 hover:text-gold transition text-sm">📦 Sản phẩm</router-link>
            <router-link to="/admin/orders" @click="showAdminMenu = false"
                         class="block px-4 py-2.5 text-light hover:bg-gold/10 hover:text-gold transition text-sm">📋 Đơn hàng</router-link>
            <router-link to="/admin/contacts" @click="showAdminMenu = false"
                         class="block px-4 py-2.5 text-light hover:bg-gold/10 hover:text-gold transition text-sm">💬 Tin nhắn</router-link>
            <router-link to="/orders" @click="showAdminMenu = false"
                         class="block px-4 py-2.5 text-light hover:bg-gold/10 hover:text-gold transition text-sm border-t border-white/5">📋 Lịch sử đơn hàng</router-link>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-4">
        <router-link to="/cart" class="text-muted hover:text-gold transition relative text-xl">
          🛒
          <span v-if="cartStore.totalItems > 0" 
                class="absolute -top-2 -right-3 bg-gold text-dark text-xs font-bold px-2 rounded-full">
            {{ cartStore.totalItems }}
          </span>
        </router-link>

        <template v-if="authStore.isLoggedIn">
          <router-link to="/profile" class="text-muted hover:text-gold transition text-sm">
              👤 {{ authStore.user?.name || 'User' }}
          </router-link>
          <button @click="handleLogout" class="text-muted hover:text-gold transition text-sm tracking-wider">Đăng xuất</button>
        </template>
        <router-link v-else to="/login" class="bg-gold text-dark px-4 py-2 rounded hover:bg-goldHover transition-all text-sm font-semibold tracking-wider">Đăng nhập</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  cartStore.clearCartOnLogout()
  cartStore.loadCart()
  router.push('/')
}

// ✅ Dropdown "Quản lý" cho admin
const showAdminMenu = ref(false)
const adminMenuRef = ref(null)

const handleClickOutside = (e) => {
  if (adminMenuRef.value && !adminMenuRef.value.contains(e.target)) {
    showAdminMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>