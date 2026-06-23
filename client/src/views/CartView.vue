<template>
  <div class="cart-page">
    <h1>🛒 Giỏ hàng</h1>

    <div v-if="cartStore.items.length > 0">
      <div class="cart-items glass-card">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-price">{{ formatPrice(item.price) }}</p>
          </div>
          <div class="item-quantity">
            <button @click="updateQuantity(item.id, item.quantity - 1)" class="qty-btn">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)" class="qty-btn">+</button>
          </div>
          <p class="item-total">{{ formatPrice(item.price * item.quantity) }}</p>
          <button @click="removeItem(item.id)" class="btn-remove">✕</button>
        </div>
      </div>

      <div class="cart-summary glass-card">
        <h3>Tổng tiền: {{ formatPrice(cartStore.totalPrice) }}</h3>
        <div class="summary-buttons">
          <button @click="clearCart" class="btn btn-dark">Xóa hết</button>
          <router-link to="/checkout" class="btn btn-primary">Thanh toán</router-link>
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <h2>Giỏ hàng trống</h2>
      <p>Chưa có gì cả, qua shop chọn đồ đi bạn.</p>
      <router-link to="/products" class="btn btn-primary">Xem sản phẩm</router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const updateQuantity = (id, quantity) => {
  cartStore.updateQuantity(id, quantity)
}

const removeItem = (id) => {
  if (confirm('Xóa món này khỏi giỏ?')) {
    cartStore.removeFromCart(id)
  }
}

const clearCart = () => {
  if (confirm('Xóa hết giỏ hàng?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 28px;
}
.cart-page h1 {
  font-size: 34px;
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 700;
}
.cart-items {
  padding: 20px 28px;
  margin-bottom: 28px;
}
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto 40px;
  gap: 20px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.cart-item:last-child {
  border-bottom: none;
}
.cart-item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}
.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.item-price {
  color: var(--text-muted);
  font-size: 14px;
}
.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}
.item-quantity span {
  font-size: 16px;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}
.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: 50%;
  font-size: 16px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}
.qty-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.item-total {
  font-weight: 700;
  font-size: 17px;
  color: var(--accent);
}
.btn-remove {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.3s;
}
.btn-remove:hover {
  color: #c0392b;
}
.cart-summary {
  padding: 24px 28px;
  text-align: right;
}
.cart-summary h3 {
  font-size: 24px;
  letter-spacing: 2px;
  margin-bottom: 18px;
}
.summary-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.empty-cart {
  text-align: center;
  padding: 80px 20px;
}
.empty-cart h2 {
  font-size: 28px;
  letter-spacing: 3px;
  margin-bottom: 8px;
}
.empty-cart p {
  color: var(--text-muted);
  font-size: 16px;
  font-style: italic;
  margin-bottom: 28px;
}
</style>