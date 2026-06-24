<template>
  <div class="dashboard p-6 pt-24 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-light tracking-wider mb-6">📊 Tổng quan</h1>

    <!-- ===== 4 Ô THỐNG KÊ ===== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5 hover:border-gold/50 transition-all">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted text-sm uppercase tracking-wider">Doanh thu hôm nay</p>
            <p class="text-2xl font-bold text-gold mt-1">{{ formatPrice(todayRevenue) }}</p>
          </div>
          <span class="text-3xl">💰</span>
        </div>
        <p class="text-xs text-muted mt-2">📈 +{{ todayOrders }} đơn hôm nay</p>
      </div>

      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5 hover:border-gold/50 transition-all">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted text-sm uppercase tracking-wider">Doanh thu tháng này</p>
            <p class="text-2xl font-bold text-gold mt-1">{{ formatPrice(monthRevenue) }}</p>
          </div>
          <span class="text-3xl">📊</span>
        </div>
        <p class="text-xs text-muted mt-2">📅 {{ monthOrders }} đơn trong tháng</p>
      </div>

      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5 hover:border-gold/50 transition-all">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted text-sm uppercase tracking-wider">Tổng đơn hàng</p>
            <p class="text-2xl font-bold text-light mt-1">{{ totalOrders }}</p>
          </div>
          <span class="text-3xl">📦</span>
        </div>
        <p class="text-xs text-muted mt-2">🔄 {{ pendingOrders }} đang xử lý</p>
      </div>

      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5 hover:border-gold/50 transition-all">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-muted text-sm uppercase tracking-wider">Khách hàng</p>
            <p class="text-2xl font-bold text-light mt-1">{{ totalCustomers }}</p>
          </div>
          <span class="text-3xl">👤</span>
        </div>
        <p class="text-xs text-muted mt-2">🆕 +{{ newCustomers }} khách mới</p>
      </div>
    </div>

    <!-- ===== 2 CỘT: BIỂU ĐỒ + SẢN PHẨM BÁN CHẠY ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <!-- Biểu đồ doanh thu -->
      <div class="lg:col-span-2 bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5">
        <h3 class="text-light font-semibold tracking-wide mb-3">📈 Doanh thu theo tháng</h3>
        <div class="h-64">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <!-- Top sản phẩm bán chạy -->
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5">
        <h3 class="text-light font-semibold tracking-wide mb-3">🏆 Top 5 sản phẩm bán chạy</h3>
        <div v-if="topProducts.length > 0" class="space-y-2">
          <div v-for="(item, index) in topProducts" :key="index" 
               class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div class="flex items-center gap-3">
              <span class="text-muted text-sm font-bold w-5">#{{ index + 1 }}</span>
              <span class="text-light text-sm truncate max-w-[120px]">{{ item.name }}</span>
            </div>
            <span class="text-gold text-sm font-semibold">{{ item.totalSold }} đã bán</span>
          </div>
        </div>
        <p v-else class="text-muted text-sm italic text-center py-4">Chưa có dữ liệu</p>
      </div>
    </div>

    <!-- ===== BẢNG ĐƠN HÀNG GẦN ĐÂY ===== -->
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5 mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-light font-semibold tracking-wide">📋 Đơn hàng gần đây</h3>
        <router-link to="/admin/orders" class="text-gold text-sm hover:text-goldHover transition">Xem tất cả →</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-muted border-b border-white/5">
              <th class="text-left py-2 px-3 font-medium">Khách hàng</th>
              <th class="text-left py-2 px-3 font-medium">Sản phẩm</th>
              <th class="text-left py-2 px-3 font-medium">Tổng tiền</th>
              <th class="text-left py-2 px-3 font-medium">Trạng thái</th>
              <th class="text-left py-2 px-3 font-medium">Ngày</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="border-b border-white/5 hover:bg-white/5 transition">
              <td class="py-2 px-3 text-light">{{ order.customerName }}</td>
              <td class="py-2 px-3 text-muted">{{ order.productName }}</td>
              <td class="py-2 px-3 text-gold font-semibold">{{ formatPrice(order.total) }}</td>
              <td class="py-2 px-3">
                <span :class="statusClass(order.status)" class="text-xs px-2 py-1 rounded-full">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-2 px-3 text-muted text-xs">{{ formatDate(order.createdAt) }}</td>
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="5" class="text-center text-muted italic py-4">Chưa có đơn hàng nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== CẢNH BÁO + TRUY CẬP NHANH ===== -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Cảnh báo -->
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5">
        <h3 class="text-light font-semibold tracking-wide mb-3">⚠️ Cảnh báo tồn kho</h3>
        <div v-if="lowStockProducts.length > 0" class="space-y-2">
          <div v-for="item in lowStockProducts" :key="item.id" 
               class="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span class="text-light text-sm">{{ item.name }}</span>
            <span class="text-red-500 text-sm font-bold">Tồn: {{ item.stock }}</span>
          </div>
        </div>
        <p v-else class="text-muted text-sm italic text-center py-4">✅ Tất cả sản phẩm đều đủ hàng</p>
      </div>

      <!-- Truy cập nhanh -->
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-5">
        <h3 class="text-light font-semibold tracking-wide mb-3">⚡ Truy cập nhanh</h3>
        <div class="grid grid-cols-2 gap-3">
          <router-link to="/admin/products" 
                       class="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center hover:bg-gold/20 transition-all">
            <span class="text-3xl block">📦</span>
            <span class="text-light text-sm font-semibold">Sản phẩm</span>
          </router-link>
          <router-link to="/admin/orders" 
                       class="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center hover:bg-gold/20 transition-all">
            <span class="text-3xl block">📋</span>
            <span class="text-light text-sm font-semibold">Đơn hàng</span>
          </router-link>
          <router-link to="/admin/customers" 
                       class="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center hover:bg-gold/20 transition-all">
            <span class="text-3xl block">👤</span>
            <span class="text-light text-sm font-semibold">Khách hàng</span>
          </router-link>
          <router-link to="/admin/settings" 
                       class="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center hover:bg-gold/20 transition-all">
            <span class="text-3xl block">⚙️</span>
            <span class="text-light text-sm font-semibold">Cài đặt</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useOrdersStore } from '../../stores/orders'
import { useAuthStore } from '../../stores/auth'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

// ===== DỮ LIỆU =====
const totalOrders = ref(0)
const pendingOrders = ref(0)
const todayOrders = ref(0)
const monthOrders = ref(0)
const todayRevenue = ref(0)
const monthRevenue = ref(0)
const totalCustomers = ref(0)
const newCustomers = ref(0)
const recentOrders = ref([])
const topProducts = ref([])
const lowStockProducts = ref([])

// ===== HÀM =====
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const formatDate = (date) => {
  if (!date) return '--/--/----'
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

const statusClass = (status) => {
  const map = {
    'pending': 'bg-yellow-500/20 text-yellow-500',
    'processing': 'bg-blue-500/20 text-blue-400',
    'shipped': 'bg-purple-500/20 text-purple-400',
    'delivered': 'bg-green-500/20 text-green-400',
    'cancelled': 'bg-red-500/20 text-red-500'
  }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

// ===== LẤY DỮ LIỆU =====
const fetchDashboardData = async () => {
  try {
    // Lấy danh sách đơn hàng (nếu có API)
    await ordersStore.fetchAllOrders()
    const orders = ordersStore.orders || []
    
    // Lấy danh sách sản phẩm
    await productsStore.fetchProducts()
    const products = productsStore.products || []

    // Thống kê đơn hàng
    totalOrders.value = orders.length
    pendingOrders.value = orders.filter(o => o.status === 'pending' || o.status === 'processing').length
    todayOrders.value = orders.filter(o => {
      const today = new Date().toDateString()
      return new Date(o.createdAt).toDateString() === today
    }).length
    monthOrders.value = orders.filter(o => {
      const now = new Date()
      const d = new Date(o.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    // Doanh thu
    todayRevenue.value = orders
      .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
      .reduce((sum, o) => sum + (o.total || 0), 0)
    monthRevenue.value = orders
      .filter(o => {
        const now = new Date()
        const d = new Date(o.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, o) => sum + (o.total || 0), 0)

    // Khách hàng
    const users = await fetch('/api/auth/users').then(res => res.json()).catch(() => [])
    totalCustomers.value = users.length || 0
    newCustomers.value = users.filter(u => {
      const now = new Date()
      const d = new Date(u.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length || 0

    // Đơn hàng gần đây (lấy 5 đơn mới nhất)
    recentOrders.value = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(o => ({
        id: o._id,
        customerName: o.shippingAddress?.name || o.user?.name || 'Khách',
        productName: o.items?.[0]?.name || 'Sản phẩm',
        total: o.totalPrice || o.total || 0,
        status: o.status || 'pending',
        createdAt: o.createdAt
      }))

    // Top sản phẩm bán chạy
    const productSales = {}
    orders.forEach(o => {
      if (o.items) {
        o.items.forEach(item => {
          const name = item.name
          if (!productSales[name]) productSales[name] = 0
          productSales[name] += item.quantity || 1
        })
      }
    })
    topProducts.value = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, totalSold]) => ({ name, totalSold }))

    // Sản phẩm sắp hết hàng (stock < 5)
    lowStockProducts.value = products
      .filter(p => p.stock !== undefined && p.stock < 5)
      .map(p => ({ id: p._id, name: p.name, stock: p.stock }))

    // Vẽ biểu đồ
    setTimeout(drawChart, 300)

  } catch (error) {
    console.error('Lỗi tải dashboard:', error)
  }
}

// ===== VẼ BIỂU ĐỒ =====
const drawChart = () => {
  const canvas = document.getElementById('revenueChart')
  if (!canvas) return

  // Dữ liệu mẫu (sau này thay bằng API thật)
  const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  // Nếu có đơn hàng, tính doanh thu theo tháng
  ordersStore.orders?.forEach(o => {
    if (o.createdAt) {
      const month = new Date(o.createdAt).getMonth()
      data[month] += o.totalPrice || o.total || 0
    }
  })

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: data,
        backgroundColor: 'rgba(212, 175, 55, 0.6)',
        borderColor: '#d4af37',
        borderWidth: 2,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#a89888' }
        }
      },
      scales: {
        y: {
          ticks: {
            color: '#a89888',
            callback: (value) => value.toLocaleString('vi-VN') + 'đ'
          },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        x: {
          ticks: { color: '#a89888' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  })
}

// ===== MOUNTED =====
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard {
  min-height: 80vh;
}
</style>