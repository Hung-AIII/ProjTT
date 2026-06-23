<template>
  <div class="checkout-page">
    <h1>💳 Thanh toán</h1>
    
    <div v-if="cartStore.items.length > 0" class="checkout-container">
      <div class="order-summary glass-card">
        <h3>Đơn hàng của bạn</h3>
        <div v-for="item in cartStore.items" :key="item.id" class="order-item">
          <span>{{ item.name }} × {{ item.quantity }}</span>
          <span>{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <div class="order-total">
          <strong>Tổng cộng</strong>
          <strong>{{ formatPrice(cartStore.totalPrice) }}</strong>
        </div>
        <div class="bank-info">
          <p><strong>🏦 Chuyển khoản:</strong></p>
          <p>Ngân hàng: MB Bank</p>
          <p>Chủ tài khoản: Nguyễn Hữu Hùng</p>
          <p>Số TK: 15755551156868</p>
          <p class="note">* Nội dung chuyển: Tên + SĐT</p>
        </div>
      </div>

      <div class="shipping-form glass-card">
        <h3>Thông tin giao hàng</h3>
        <form @submit.prevent="handleCheckout">
          <div class="form-group">
            <label>Họ tên *</label>
            <input type="text" v-model="shippingInfo.name" required />
          </div>
          <div class="form-group">
            <label>SĐT *</label>
            <input type="tel" v-model="shippingInfo.phone" required />
          </div>
          <div class="form-group">
            <label>Địa chỉ *</label>
            <input type="text" v-model="shippingInfo.address" required />
          </div>
          <div class="form-group">
            <label>Ghi chú</label>
            <textarea v-model="shippingInfo.note" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Xác nhận đặt hàng</button>
        </form>
      </div>
    </div>

    <div v-else class="empty-cart">
      <h2>Giỏ hàng trống</h2>
      <p>Thêm đồ vào rồi thanh toán nhé.</p>
      <router-link to="/products" class="btn btn-primary">Xem sản phẩm</router-link>
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const handleCheckout = async () => {
  if (!authStore.isLoggedIn) {
    alert('Vui lòng đăng nhập để đặt hàng!')
    router.push('/login')
    return
  }

  const orderData = {
    items: cartStore.items,
    total: cartStore.totalPrice,
    shipping: shippingInfo.value
  }

  const result = await ordersStore.createOrder(orderData)
  if (result.success) {
    cartStore.clearCart()
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng. 🎉')
    router.push('/')
  } else {
    alert(result.message || 'Có lỗi, vui lòng thử lại.')
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 28px;
}
.checkout-page h1 {
  font-size: 34px;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 32px;
  font-weight: 700;
}
.checkout-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 32px;
}
.order-summary, .shipping-form {
  padding: 28px;
}
.order-summary h3, .shipping-form h3 {
  font-size: 20px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 15px;
}
.order-total {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid var(--accent);
}
.bank-info {
  margin-top: 16px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}
.bank-info p {
  margin: 4px 0;
  font-size: 14px;
  color: var(--text-muted);
}
.bank-info .note {
  color: var(--accent);
  font-style: italic;
  font-size: 13px;
  margin-top: 6px;
}
.btn-full {
  width: 100%;
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