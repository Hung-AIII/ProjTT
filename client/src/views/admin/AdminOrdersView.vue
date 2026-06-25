<template>
  <div class="p-6 pt-24">
    <h1 class="text-3xl font-bold text-light tracking-wider">📋 Quản lý đơn hàng</h1>

    <!-- Ghi chú quy trình -->
    <div class="bg-gold/10 border border-gold/20 rounded-lg p-4 mt-4 text-sm text-muted">
      💡 <strong class="text-gold">Quy trình duyệt đơn:</strong>
      Khách chuyển khoản hoặc COD → Kiểm tra → Đổi
      <span class="text-gold">"Đã giao"</span>
      để xác nhận nhận tiền → Doanh thu tự động cập nhật
    </div>

    <!-- Thống kê nhanh -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-3 text-center">
        <p class="text-muted text-xs uppercase">Tổng đơn</p>
        <p class="text-xl font-bold text-light mt-1">{{ ordersStore.orders.length }}</p>
      </div>
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-3 text-center">
        <p class="text-muted text-xs uppercase">Đang xử lý</p>
        <p class="text-xl font-bold text-yellow-400 mt-1">{{ pendingCount }}</p>
      </div>
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-3 text-center">
        <p class="text-muted text-xs uppercase">Đã giao</p>
        <p class="text-xl font-bold text-green-400 mt-1">{{ deliveredCount }}</p>
      </div>
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-3 text-center">
        <p class="text-muted text-xs uppercase">Đã hủy</p>
        <p class="text-xl font-bold text-red-500 mt-1">{{ cancelledCount }}</p>
      </div>
    </div>

    <!-- Bảng đơn hàng -->
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden mt-6">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Mã đơn</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Khách hàng</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tổng tiền</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thanh toán</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Trạng thái</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Ngày đặt</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ordersStore.loading">
            <td colspan="7" class="text-center text-muted italic py-8">Đang tải...</td>
          </tr>
          <template v-else-if="ordersStore.orders.length > 0">
            <tr v-for="order in ordersStore.orders" :key="order._id"
                class="border-t border-white/5 hover:bg-white/5 transition"
                :class="{ 'opacity-50': order.status === 'cancelled' }">

              <td class="px-4 py-3 text-muted text-sm">#{{ order._id?.slice(-6) }}</td>

              <td class="px-4 py-3">
                <p class="text-light font-medium">{{ order.shippingAddress?.name || 'Khách' }}</p>
                <p class="text-muted text-xs">{{ order.shippingAddress?.phone || '' }}</p>
              </td>

              <td class="px-4 py-3 text-gold font-semibold">{{ formatPrice(order.totalPrice) }}</td>

              <!-- Thanh toán -->
              <td class="px-4 py-3">
                <div class="space-y-1">
                  <span class="text-xs block" :class="order.paymentMethod === 'bank' ? 'text-blue-400' : 'text-muted'">
                    {{ order.paymentMethod === 'bank' ? '🏦 Chuyển khoản' : '🚚 COD' }}
                  </span>
                  <span v-if="order.isPaid"
                        class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    ✅ Đã nhận tiền
                  </span>
                  <span v-else-if="order.status !== 'cancelled'"
                        class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    ⏳ Chưa nhận
                  </span>
                </div>
              </td>

              <!-- Trạng thái -->
              <td class="px-4 py-3">
                <span :class="statusClass(order.status)" class="text-xs px-3 py-1 rounded-full font-semibold">
                  {{ statusText(order.status) }}
                </span>
              </td>

              <td class="px-4 py-3 text-muted text-sm">{{ formatDate(order.createdAt) }}</td>

              <!-- Dropdown đổi trạng thái -->
              <td class="px-4 py-3">
                <select
                  v-if="order.status !== 'cancelled'"
                  @change="updateStatus(order._id, $event.target.value)"
                  :value="order.status"
                  class="bg-dark2 border border-white/10 rounded px-2 py-1 text-light text-sm focus:border-gold focus:outline-none"
                >
                  <option value="pending">⏳ Đang xử lý</option>
                  <option value="processing">🔄 Đang chuẩn bị</option>
                  <option value="shipped">🚚 Đang giao</option>
                  <option value="delivered">✅ Đã giao (nhận tiền)</option>
                  <option value="cancelled">❌ Hủy đơn</option>
                </select>
                <span v-else class="text-red-500 text-xs italic">Đã hủy</span>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="7" class="text-center text-muted italic py-8">Chưa có đơn hàng nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const ordersStore = useOrdersStore()

// ===== COMPUTED =====
const pendingCount = computed(() =>
  ordersStore.orders.filter(o => o.status === 'pending' || o.status === 'processing').length
)
const deliveredCount = computed(() =>
  ordersStore.orders.filter(o => o.status === 'delivered').length
)
const cancelledCount = computed(() =>
  ordersStore.orders.filter(o => o.status === 'cancelled').length
)

// ===== FORMAT =====
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const formatDate = (date) => {
  if (!date) return '--/--/----'
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

const statusText = (status) => {
  const map = {
    pending:    '⏳ Đang xử lý',
    processing: '🔄 Đang chuẩn bị',
    shipped:    '🚚 Đang giao',
    delivered:  '✅ Đã giao',
    cancelled:  '❌ Đã hủy'
  }
  return map[status] || status
}

const statusClass = (status) => {
  const map = {
    pending:    'bg-yellow-500/20 text-yellow-500',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped:    'bg-purple-500/20 text-purple-400',
    delivered:  'bg-green-500/20 text-green-400',
    cancelled:  'bg-red-500/20 text-red-500'
  }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

// ===== ACTIONS =====
const updateStatus = async (id, status) => {
  if (status === 'cancelled' && !confirm('Hủy đơn hàng này?\nTồn kho sẽ được hoàn lại tự động.')) return
  if (status === 'delivered' && !confirm('Xác nhận đã giao hàng và nhận tiền?\nDoanh thu sẽ được cập nhật.')) return
  await ordersStore.updateOrderStatus(id, status)
}

// ===== MOUNTED =====
onMounted(() => {
  ordersStore.fetchAllOrders()
})
</script>