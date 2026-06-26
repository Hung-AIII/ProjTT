<template>
  <div class="pt-20 max-w-5xl mx-auto px-6">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase">🛒 Giỏ hàng</h1>

    <div v-if="cartStore.items.length > 0">
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6 mt-6">
        <div v-for="item in cartStore.items" :key="item.id"
             class="grid grid-cols-[80px_1fr_auto_auto_40px] gap-4 items-center py-4 border-b border-white/5 last:border-0">
          <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
          <div>
            <h3 class="text-light font-semibold">{{ item.name }}</h3>
            <p class="text-muted text-sm">{{ formatPrice(item.price) }}</p>
            <!-- ✅ Hiển thị cảnh báo tồn kho -->
            <p v-if="item.stock && item.quantity >= item.stock"
               class="text-yellow-400 text-xs mt-0.5">
              ⚠ Đã đạt số lượng tối đa ({{ item.stock }})
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-7 h-7 border border-white/10 rounded-full hover:border-gold hover:text-gold transition">−</button>
            <span class="w-7 text-center font-bold text-light">{{ item.quantity }}</span>
            <button
              @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
              :disabled="item.stock && item.quantity >= item.stock"
              :class="item.stock && item.quantity >= item.stock
                ? 'opacity-30 cursor-not-allowed border-white/10'
                : 'hover:border-gold hover:text-gold'"
              class="w-7 h-7 border border-white/10 rounded-full transition">+</button>
          </div>
          <p class="text-gold font-bold">{{ formatPrice(item.price * item.quantity) }}</p>
          <button @click="removeItem(item.id)"
                  class="text-muted hover:text-red-500 transition text-xl">✕</button>
        </div>
      </div>

      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6 mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-2xl font-bold text-light">Tổng: {{ formatPrice(cartStore.totalPrice) }}</h3>
          <p class="text-muted text-sm">{{ cartStore.totalItems }} sản phẩm</p>
        </div>
        <div class="flex gap-3">
          <button @click="clearCart"
                  class="border border-gold text-light px-6 py-2 rounded hover:bg-gold hover:text-dark transition-all text-sm">
            Xóa hết
          </button>
          <router-link to="/checkout"
                       class="bg-gold text-dark px-6 py-2 rounded hover:bg-goldHover transition-all text-sm font-semibold">
            Thanh toán
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <span class="text-6xl block mb-4">🛒</span>
      <h2 class="text-2xl font-bold text-light">Giỏ hàng trống</h2>
      <p class="text-muted italic mt-1">Chưa có gì cả, qua shop chọn đồ đi bạn.</p>
      <router-link to="/products"
                   class="inline-block bg-gold text-dark px-6 py-3 rounded hover:bg-goldHover transition-all mt-4 font-semibold">
        Xem sản phẩm
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const removeItem = (id) => {
  if (confirm('Xóa món này khỏi giỏ?')) cartStore.removeFromCart(id)
}
const clearCart = () => {
  if (confirm('Xóa hết giỏ hàng?')) cartStore.clearCart()
}
</script>