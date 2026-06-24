<template>
  <div class="pt-20 max-w-6xl mx-auto px-6">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase">💳 Thanh toán</h1>
    
    <div v-if="cartStore.items.length > 0" class="grid md:grid-cols-2 gap-6 mt-6">
      <!-- Order Summary -->
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6">
        <h3 class="text-xl font-bold text-light tracking-wide">Đơn hàng của bạn</h3>
        <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between py-2 border-b border-white/5">
          <span class="text-light">{{ item.name }} × {{ item.quantity }}</span>
          <span class="text-gold">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <div class="flex justify-between text-xl font-bold pt-3 border-t border-gold mt-2">
          <span class="text-light">Tổng cộng</span>
          <span class="text-gold">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="mt-4 p-4 bg-gold/10 border border-gold/20 rounded-lg">
          <p class="text-light font-semibold">🏦 Chuyển khoản:</p>
          <p class="text-muted text-sm">Ngân hàng: MB Bank</p>
          <p class="text-muted text-sm">Chủ TK: Nguyễn Hữu Hùng</p>
          <p class="text-muted text-sm">Số TK: 15755551156868</p>
          <p class="text-gold text-sm italic mt-1">* Nội dung: Tên + SĐT</p>
        </div>
      </div>

      <!-- Shipping Form -->
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6">
        <h3 class="text-xl font-bold text-light tracking-wide">Thông tin giao hàng</h3>
        <form @submit.prevent="handleCheckout" class="mt-4 space-y-4">
          <div>
            <label class="block text-light text-sm font-semibold">Họ tên *</label>
            <input type="text" v-model="shippingInfo.name" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">SĐT *</label>
            <input type="tel" v-model="shippingInfo.phone" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">Địa chỉ *</label>
            <input type="text" v-model="shippingInfo.address" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">Ghi chú</label>
            <textarea v-model="shippingInfo.note" rows="2"
                      class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none resize-none"></textarea>
          </div>
          <button type="submit" class="bg-gold text-dark w-full py-3 rounded hover:bg-goldHover transition-all font-semibold tracking-wider">Xác nhận đặt hàng</button>
        </form>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-light">Giỏ hàng trống</h2>
      <p class="text-muted italic mt-1">Thêm đồ vào rồi thanh toán nhé.</p>
      <router-link to="/products" class="inline-block bg-gold text-dark px-6 py-3 rounded hover:bg-goldHover transition-all mt-4 font-semibold">Xem sản phẩm</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const shippingInfo = ref({
  name: authStore.user?.name || '',
  phone: '',
  address: '',
  note: ''
})

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const handleCheckout = async () => {
  if (!authStore.isLoggedIn) {
    alert('Vui lòng đăng nhập để đặt hàng!')
    router.push('/login')
    return
  }
  const result = await ordersStore.createOrder({
    items: cartStore.items,
    total: cartStore.totalPrice,
    shipping: shippingInfo.value
  })
  if (result.success) {
    cartStore.clearCart()
    alert('Đặt hàng thành công! 🎉')
    router.push('/')
  } else {
    alert('Có lỗi, vui lòng thử lại.')
  }
}
</script>