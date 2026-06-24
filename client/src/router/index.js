import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Public routes
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ContactView from '../views/ContactView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import NotFound from '../views/NotFound.vue'
import OrderHistoryView from '../views/OrderHistoryView.vue'
// Protected routes
import CheckoutView from '../views/CheckoutView.vue'

// Admin routes
import DashboardView from '../views/admin/DashboardView.vue'
import AdminProductsView from '../views/admin/AdminProductsView.vue'
import AdminOrdersView from '../views/admin/AdminOrdersView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Trang chủ' }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { title: 'Sản phẩm' }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: 'Chi tiết sản phẩm' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: { title: 'Liên hệ' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartView,
    meta: { title: 'Giỏ hàng' }
  },
  {
  path: '/orders',
  name: 'Orders',
  component: OrderHistoryView,
  meta: { title: 'Lịch sử đơn hàng', requiresAuth: true }
},
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Đăng nhập', guest: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView,
    meta: { title: 'Đặt hàng', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProductsView,
    meta: { title: 'Quản lý sản phẩm', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrdersView,
    meta: { title: 'Quản lý đơn hàng', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 - Không tìm thấy' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `Shop Quần Áo | ${to.meta.title}` : 'Shop Quần Áo'
  
  const authStore = useAuthStore()
  
  // 🔥 Nếu có token nhưng chưa có user, gọi API lấy user
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
  
  // 🔥 Kiểm tra admin
  if (to.meta.requiresAdmin) {
    if (!authStore.isLoggedIn) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    // Kiểm tra role admin
    if (authStore.user?.role !== 'admin') {
      console.warn('🚫 Không phải admin, chuyển về trang chủ')
      return next({ name: 'Home' })
    }
  }
  
  // Kiểm tra yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  
  // Nếu đã đăng nhập mà vào trang login → về trang chủ
  if (to.meta.guest && authStore.isLoggedIn) {
    return next({ name: 'Home' })
  }
  
  next()
})

export default router