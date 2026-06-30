<template>
  <div class="pt-20 max-w-7xl mx-auto px-4 sm:px-6">
    <!-- Tiêu đề -->
    <div class="text-center mb-8">
      <span class="text-gold text-xs tracking-[0.3em] uppercase font-semibold">Bộ sưu tập</span>
      <h1 class="text-4xl font-bold tracking-widest uppercase mt-1">🛍️ Sản phẩm</h1>
      <p class="text-muted italic mt-2">
        {{ productsStore.pagination.total }} sản phẩm đang chờ bạn khám phá
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 bg-dark3/60 border border-white/5 rounded-xl p-4 mb-8">
      <div class="relative flex-1 min-w-[220px]">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..."
               class="w-full bg-dark2 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none transition" />
      </div>
      <select v-model="sortBy"
              class="bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none transition">
        <option value="default">Sắp xếp theo</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
        <option value="name">Tên A → Z</option>
      </select>
      <select v-model="categoryFilter"
              class="bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none transition">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <!-- Nút xoá bộ lọc, chỉ hiện khi có filter đang áp dụng -->
      <button v-if="searchQuery || categoryFilter || sortBy !== 'default'"
              @click="resetFilters"
              class="text-muted hover:text-gold text-sm border border-white/10 hover:border-gold/50 rounded-lg px-4 py-3 transition">
        ✕ Xoá lọc
      </button>
    </div>

    <!-- Skeleton loading -->
    <div v-if="productsStore.loadingList" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="bg-dark3/60 border border-white/5 rounded-xl overflow-hidden animate-pulse">
        <div class="aspect-[4/5] bg-white/5"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 bg-white/5 rounded w-3/4"></div>
          <div class="h-4 bg-white/5 rounded w-1/2"></div>
          <div class="h-9 bg-white/5 rounded mt-3"></div>
        </div>
      </div>
    </div>

    <!-- Không có kết quả -->
    <div v-else-if="sortedProducts.length === 0" class="text-center py-20">
      <p class="text-5xl mb-3">🔍</p>
      <p class="text-muted text-lg italic">Không tìm thấy sản phẩm nào phù hợp.</p>
      <button @click="resetFilters" class="text-gold hover:underline mt-3 text-sm">Xoá bộ lọc và thử lại</button>
    </div>

    <!-- Lưới sản phẩm -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <ProductCard v-for="product in sortedProducts" :key="product._id || product.id" :product="product" />
    </div>

    <!-- Phân trang -->
    <div v-if="!productsStore.loadingList && productsStore.pagination.pages > 1"
         class="flex flex-wrap justify-center items-center gap-2 mt-12 mb-8">

      <!-- Trang trước -->
      <button @click="goToPage(productsStore.pagination.page - 1)"
              :disabled="productsStore.pagination.page <= 1"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-light hover:border-gold hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-light">
        ‹
      </button>

      <!-- Các số trang -->
      <button v-for="p in visiblePages" :key="p"
              @click="typeof p === 'number' && goToPage(p)"
              :disabled="p === '...'"
              :class="[
                'min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition',
                p === productsStore.pagination.page
                  ? 'bg-gold text-dark font-bold'
                  : p === '...'
                    ? 'text-muted cursor-default'
                    : 'border border-white/10 text-light hover:border-gold hover:text-gold'
              ]">
        {{ p }}
      </button>

      <!-- Trang sau -->
      <button @click="goToPage(productsStore.pagination.page + 1)"
              :disabled="productsStore.pagination.page >= productsStore.pagination.pages"
              class="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-light hover:border-gold hover:text-gold transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-light">
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const productsStore = useProductsStore()
const searchQuery = ref('')
const sortBy = ref('default')
const categoryFilter = ref('')
const currentPage = ref(1)

const allCategories = ref([])
const categories = computed(() => allCategories.value)

const sortedProducts = computed(() => {
  let products = [...productsStore.products]
  switch (sortBy.value) {
    case 'price-asc': products.sort((a, b) => a.price - b.price); break
    case 'price-desc': products.sort((a, b) => b.price - a.price); break
    case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break
  }
  return products
})

// ✅ Sinh dải số trang dạng "1 2 3 ... 8 9 10" thay vì liệt kê hết, gọn và đẹp hơn khi nhiều trang
const visiblePages = computed(() => {
  const total = productsStore.pagination.pages
  const current = productsStore.pagination.page
  const delta = 1 // số trang hiện 2 bên trang hiện tại
  const range = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  // Chèn dấu "..." vào chỗ bị nhảy số
  const result = []
  let prev = null
  for (const i of range) {
    if (prev !== null && i - prev > 1) result.push('...')
    result.push(i)
    prev = i
  }
  return result
})

const loadProducts = () => {
  productsStore.fetchProducts({
    page: currentPage.value,
    limit: 12,
    search: searchQuery.value || undefined,
    category: categoryFilter.value || undefined,
  })
}

const goToPage = (page) => {
  if (page < 1 || page > productsStore.pagination.pages) return
  currentPage.value = page
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  sortBy.value = 'default'
}

watch([searchQuery, categoryFilter], () => {
  currentPage.value = 1
  loadProducts()
})

onMounted(async () => {
  allCategories.value = await productsStore.fetchAllCategoriesOnce()
  loadProducts()
})
</script>