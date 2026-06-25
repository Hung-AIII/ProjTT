<!-- THAY TOÀN BỘ <template> bằng: -->
<template>
  <div class="p-6 pt-24">
    <h1 class="text-3xl font-bold text-light tracking-wider">📋 Quản lý đơn hàng</h1>
    
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden mt-6">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Mã đơn</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Khách hàng</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tổng tiền</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Trạng thái</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Ngày đặt</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thanh toán</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ordersStore.loading">
            <td colspan="6" class="text-center text-muted italic py-6">Đang tải...</td>
          </tr>
          <template v-else-if="ordersStore.orders.length > 0">
            <tr v-for="order in ordersStore.orders" :key="order._id"
                class="border-t border-white/5 hover:bg-white/5">
              <td class="px-4 py-3 text-muted">#{{ order._id?.slice(-6) }}</td>
              <td class="px-4 py-3 text-light">{{ order.shippingAddress?.name || 'Khách' }}</td>
              <td class="px-4 py-3 text-gold font-semibold">{{ formatPrice(order.totalPrice) }}</td>
              <td class="px-4 py-3">
                <span :class="statusClass(order.status)" class="text-xs px-3 py-1 rounded-full font-semibold">
                  {{ statusText(order.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-muted text-sm">{{ formatDate(order.createdAt) }}</td>
              <td class="px-4 py-3">
                <select @change="updateStatus(order._id, $event.target.value)"
                        :value="order.status"
                        class="bg-dark2 border border-white/10 rounded px-2 py-1 text-light text-sm focus:border-gold focus:outline-none">
                  <option value="pending">Đang xử lý</option>
                  <option value="processing">Đang chuẩn bị</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
              <td class="px-4 py-3">
                <span v-if="order.isPaid"
                      class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                  ✅ Đã nhận tiền
                </span>
                <span v-else
                      class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-semibold">
                  ⏳ Chưa nhận
                </span>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="text-center text-muted italic py-6">Chưa có đơn hàng nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const ordersStore = useOrdersStore()

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const formatDate = (date) => {
  if (!date) return '--/--/----'
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

const statusText = (status) => {
  const map = { pending: '⏳ Đang xử lý', processing: '🔄 Đang chuẩn bị', shipped: '🚚 Đang giao', delivered: '✅ Đã giao', cancelled: '❌ Đã hủy' }
  return map[status] || status
}

const statusClass = (status) => {
  const map = { pending: 'bg-yellow-500/20 text-yellow-500', processing: 'bg-blue-500/20 text-blue-400', shipped: 'bg-purple-500/20 text-purple-400', delivered: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-500' }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

const updateStatus = async (id, status) => {
  await ordersStore.updateOrderStatus(id, status)
}

onMounted(() => {
  ordersStore.fetchAllOrders()
})
</script>