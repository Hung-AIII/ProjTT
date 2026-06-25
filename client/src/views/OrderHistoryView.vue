<template>
  <div class="pt-20 max-w-5xl mx-auto px-6">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase text-light">📋 Lịch sử đơn hàng</h1>
 
    <!-- Đang tải -->
    <div v-if="ordersStore.loading" class="text-center py-20">
      <p class="text-muted italic">Đang tải lịch sử đơn hàng...</p>
    </div>
 
    <!-- Có đơn hàng -->
    <div v-else-if="ordersStore.orders.length > 0" class="mt-6 space-y-4">
      <div v-for="order in ordersStore.orders" :key="order._id"
           class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6 hover:border-gold/30 transition-all">
 
        <!-- Header: Mã đơn + Trạng thái -->
        <div class="flex justify-between items-start flex-wrap gap-2">
          <div>
            <p class="text-muted text-sm">📦 Mã đơn: #{{ order._id?.slice(-6) || 'N/A' }}</p>
            <p class="text-light font-semibold">{{ order.shippingAddress?.name || 'Khách hàng' }}</p>
            <p class="text-muted text-sm">{{ order.shippingAddress?.address || '' }}</p>
            <!-- Phương thức thanh toán -->
            <p class="text-muted text-xs mt-1">
              {{ order.paymentMethod === 'bank' ? '🏦 Chuyển khoản' : '🚚 Thanh toán khi nhận hàng (COD)' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-gold font-bold text-xl">{{ formatPrice(order.totalPrice) }}</p>
            <span :class="statusClass(order.status)" class="text-xs px-3 py-1 rounded-full font-semibold">
              {{ statusText(order.status) }}
            </span>
          </div>
        </div>
 
        <!-- Danh sách sản phẩm -->
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="(item, idx) in order.items" :key="idx"
                class="bg-white/5 px-3 py-1 rounded-full text-muted text-sm">
            {{ item.name }} × {{ item.quantity }}
            <span class="text-gold ml-1">{{ formatPrice(item.price * item.quantity) }}</span>
          </span>
        </div>
 
        <!-- Ngày đặt + Nút hủy -->
        <div class="flex items-center justify-between mt-3">
          <p class="text-muted text-xs flex items-center gap-1">
            🕐 {{ formatDate(order.createdAt) }}
          </p>
 
          <!-- Nút hủy: chỉ hiện khi status = pending -->
          <button
            v-if="order.status === 'pending'"
            @click="cancelOrder(order._id)"
            :disabled="cancellingId === order._id"
            class="text-sm border border-red-500/50 text-red-400 px-4 py-1.5 rounded hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancellingId === order._id ? '⏳ Đang hủy...' : '❌ Hủy đơn hàng' }}
          </button>
 
          <!-- Thông báo nếu đã hủy -->
          <span v-else-if="order.status === 'cancelled'"
                class="text-xs text-red-400 italic">
            Đơn hàng đã bị hủy
          </span>
 
          <!-- Thông báo nếu đang xử lý không thể hủy -->
          <span v-else-if="order.status === 'processing' || order.status === 'shipped'"
                class="text-xs text-muted italic">
            Không thể hủy — liên hệ shop
          </span>
        </div>
 
        <!-- Thông báo lỗi hủy -->
        <p v-if="cancelError[order._id]" class="text-red-500 text-xs mt-2">
          {{ cancelError[order._id] }}
        </p>
 
      </div>
    </div>
 
    <!-- Không có đơn hàng -->
    <div v-else class="text-center py-20">
      <span class="text-6xl block mb-4">📭</span>
      <h2 class="text-2xl font-bold text-light">Chưa có đơn hàng nào</h2>
      <p class="text-muted italic mt-1">Hãy mua sắm ngay để có lịch sử đơn hàng nhé!</p>
      <router-link to="/products"
                   class="inline-block bg-gold text-dark px-6 py-3 rounded hover:bg-goldHover transition-all mt-4 font-semibold">
        🛒 Mua ngay
      </router-link>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useOrdersStore } from '../stores/orders'
import axios from 'axios'
 
const ordersStore = useOrdersStore()
 
// State hủy đơn
const cancellingId = ref(null)   // ID đơn đang xử lý hủy
const cancelError = ref({})      // Lưu lỗi theo từng order._id
 
// ===== FORMAT =====
const formatPrice = (price) => {
  if (!price) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
 
const formatDate = (date) => {
  if (!date) return '--/--/---- --:--'
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}
 
const statusText = (status) => {
  const map = {
    'pending':    '⏳ Đang xử lý',
    'processing': '🔄 Đang chuẩn bị',
    'shipped':    '🚚 Đang giao',
    'delivered':  '✅ Đã giao',
    'cancelled':  '❌ Đã hủy'
  }
  return map[status] || status
}
 
const statusClass = (status) => {
  const map = {
    'pending':    'bg-yellow-500/20 text-yellow-500',
    'processing': 'bg-blue-500/20 text-blue-400',
    'shipped':    'bg-purple-500/20 text-purple-400',
    'delivered':  'bg-green-500/20 text-green-400',
    'cancelled':  'bg-red-500/20 text-red-500'
  }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}
 
// ===== HỦY ĐƠN HÀNG =====
const cancelOrder = async (orderId) => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?\nTồn kho sẽ được hoàn lại tự động.')) return
 
  cancellingId.value = orderId
  cancelError.value[orderId] = ''
 
  try {
    const response = await axios.put(`/api/orders/${orderId}/cancel`)
 
    if (response.data.success) {
      // Cập nhật status ngay trong store không cần fetch lại
      const order = ordersStore.orders.find(o => o._id === orderId)
      if (order) order.status = 'cancelled'
    } else {
      cancelError.value[orderId] = response.data.message || 'Hủy đơn thất bại'
    }
  } catch (error) {
    cancelError.value[orderId] = error.response?.data?.message || 'Lỗi kết nối, vui lòng thử lại'
  } finally {
    cancellingId.value = null
  }
}
 
// ===== AUTO REFRESH =====
let refreshInterval = null
 
onMounted(() => {
  ordersStore.fetchMyOrders()
  refreshInterval = setInterval(() => {
    ordersStore.fetchMyOrders()
  }, 30000)
})
 
onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>