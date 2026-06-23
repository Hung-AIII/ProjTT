<template>
  <nav class="navbar">
    <div class="container nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">✦</span>
        <span class="logo-text">HÙNG HÀ</span>
        <span class="logo-dot">.</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Trang chủ</router-link>
        <router-link to="/products" class="nav-link">Sản phẩm</router-link>
        <router-link to="/contact" class="nav-link">Liên hệ</router-link>
        <template v-if="authStore.isAdmin">
          <router-link to="/admin" class="nav-link admin-link">📊 Tổng quan</router-link>
          <router-link to="/admin/products" class="nav-link admin-link">📦 Sản phẩm</router-link>
          <router-link to="/admin/orders" class="nav-link admin-link">📋 Đơn hàng</router-link>
        </template>
      </div>

      <div class="nav-right">
        <router-link to="/cart" class="cart-link">
          <span class="cart-icon">🛒</span>
          <span class="cart-badge" v-if="cartStore.totalItems > 0">
            {{ cartStore.totalItems }}
          </span>
        </router-link>

        <template v-if="authStore.isLoggedIn">
          <span class="user-name">👤 {{ authStore.user?.name || 'User' }}</span>
          <button @click="handleLogout" class="btn-logout">Đăng xuất</button>
        </template>
        <router-link v-else to="/login" class="btn-login">Đăng nhập</router-link>
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

<style scoped>
.navbar {
  background: rgba(10, 10, 10, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 248, 240, 0.06);
  padding: 18px 0;
  position: sticky;
  top: 0;
  z-index: 999;
}
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 3px;
}
.logo-icon {
  color: var(--accent);
  font-size: 22px;
}
.logo-text {
  color: var(--text-light);
  letter-spacing: 4px;
}
.logo-dot {
  color: var(--accent);
  font-size: 30px;
}
.nav-links {
  display: flex;
  gap: 36px;
  align-items: center;
}
.nav-link {
  color: var(--text-muted);
  font-size: 15px;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--accent);
  transition: all 0.3s ease;
}
.nav-link:hover {
  color: var(--text-light);
}
.nav-link:hover::after {
  width: 100%;
}
.nav-link.router-link-active {
  color: var(--accent);
}
.nav-link.router-link-active::after {
  width: 100%;
}
.admin-link {
  color: var(--accent);
}
.admin-link:hover {
  color: var(--accent-hover);
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}
.cart-link {
  position: relative;
  font-size: 22px;
  color: var(--text-muted);
  transition: color 0.3s;
}
.cart-link:hover {
  color: var(--accent);
}
.cart-badge {
  position: absolute;
  top: -10px;
  right: -12px;
  background: var(--accent);
  color: var(--primary);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 50%;
  min-width: 20px;
  text-align: center;
}
.user-name {
  color: var(--text-muted);
  font-size: 14px;
  letter-spacing: 0.5px;
}
.btn-login {
  padding: 8px 28px;
  background: var(--accent);
  color: var(--primary);
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
}
.btn-login:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(212, 175, 55, 0.3);
}
.btn-logout {
  padding: 8px 28px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-logout:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>