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
      <div class="hidden md:flex gap-8">
        <router-link to="/" class="text-muted hover:text-light transition tracking-wider">Trang chủ</router-link>
        <router-link to="/products" class="text-muted hover:text-light transition tracking-wider">Sản phẩm</router-link>
        <router-link to="/contact" class="text-muted hover:text-light transition tracking-wider">Liên hệ</router-link>
        
        <!-- 🔥 Lịch sử đơn hàng - hiển thị cho mọi user đã đăng nhập -->
        <router-link v-if="authStore.isLoggedIn" to="/orders" class="text-muted hover:text-light transition tracking-wider">
          📋 Lịch sử đơn hàng
        </router-link>
        
        <!-- Admin links -->
        <template v-if="authStore.isAdmin">
          <router-link to="/admin" class="text-gold hover:text-goldHover transition tracking-wider">📊 Tổng quan</router-link>
          <router-link to="/admin/products" class="text-gold hover:text-goldHover transition tracking-wider">📦 Sản phẩm</router-link>
          <router-link to="/admin/orders" class="text-gold hover:text-goldHover transition tracking-wider">📋 Đơn hàng</router-link>
          <router-link to="/admin/contacts" class="text-gold hover:text-goldHover transition tracking-wider">
  💬 Tin nhắn
</router-link>
        </template>
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
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>