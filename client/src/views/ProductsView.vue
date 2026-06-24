<template>
  <div class="pt-20">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase">🛍️ Sản phẩm</h1>
    
    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mt-6">
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." 
             class="flex-1 min-w-[200px] bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
      <select v-model="sortBy" class="bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none">
        <option value="default">Sắp xếp theo</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
        <option value="name">Tên A → Z</option>
      </select>
      <select v-model="categoryFilter" class="bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light focus:border-gold focus:outline-none">
        <option value="">Tất cả</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Products -->
    <div v-if="!productsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <div v-else class="text-muted text-center py-12 italic">Đang tải...</div>

    <div v-if="!productsStore.loading && filteredProducts.length === 0" 
         class="text-muted text-center py-12 italic">Không tìm thấy sản phẩm nào.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const productsStore = useProductsStore()
const searchQuery = ref('')
const sortBy = ref('default')
const categoryFilter = ref('')

const categories = computed(() => {
  const cats = new Set(productsStore.products.map(p => p.category))
  return [...cats]
})

const filteredProducts = computed(() => {
  let products = [...productsStore.products]
  if (searchQuery.value) {
    products = products.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (categoryFilter.value) {
    products = products.filter(p => p.category === categoryFilter.value)
  }
  switch (sortBy.value) {
    case 'price-asc': products.sort((a, b) => a.price - b.price); break
    case 'price-desc': products.sort((a, b) => b.price - a.price); break
    case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break
  }
  return products
})

onMounted(() => productsStore.fetchProducts())
</script>