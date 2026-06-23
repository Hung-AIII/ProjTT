<template>
  <div class="products-page">
    <h1>🛍️ Sản phẩm</h1>
    
    <div class="filter-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Tìm kiếm sản phẩm..."
        class="search-input"
      />
      <select v-model="sortBy" class="sort-select">
        <option value="default">Sắp xếp theo</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
        <option value="name">Tên A → Z</option>
      </select>
      <select v-model="categoryFilter" class="sort-select">
        <option value="">Tất cả</option>
        <option value="Áo sơ mi">Áo sơ mi</option>
        <option value="Áo thun">Áo thun</option>
        <option value="Áo khoác">Áo khoác</option>
        <option value="Áo len">Áo len</option>
        <option value="Váy">Váy</option>
        <option value="Quần">Quần</option>
        <option value="Chân váy">Chân váy</option>
        <option value="Áo hoodie">Áo hoodie</option>
        <option value="Áo blazer">Áo blazer</option>
        <option value="Áo thể thao">Áo thể thao</option>
        <option value="Đồ ngủ">Đồ ngủ</option>
        <option value="Phụ kiện">Phụ kiện</option>
      </select>
    </div>

    <div v-if="!productsStore.loading" class="product-grid">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
      />
    </div>
    <div v-else class="loading">Đang tải...</div>

    <div v-if="!productsStore.loading && filteredProducts.length === 0" class="no-products">
      Không tìm thấy sản phẩm nào hợp lệ.
    </div>
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

const filteredProducts = computed(() => {
  let products = [...productsStore.products]

  if (searchQuery.value) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    products = products.filter(p => p.category === categoryFilter.value)
  }

  switch (sortBy.value) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  return products
})

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<style scoped>
.products-page {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 28px;
}
.products-page h1 {
  font-size: 34px;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 28px;
  font-weight: 700;
}
.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 200px;
}
.sort-select {
  padding: 14px 18px;
  background: var(--secondary);
  border: 1px solid var(--border-dark);
  border-radius: 4px;
  color: var(--text-light);
  font-size: 14px;
  font-family: 'Times New Roman', Times, serif;
  cursor: pointer;
  min-width: 160px;
}
.sort-select:focus {
  outline: none;
  border-color: var(--accent);
}
.no-products {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 18px;
  font-style: italic;
}
</style>