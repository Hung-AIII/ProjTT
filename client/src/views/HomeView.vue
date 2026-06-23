<template>
  <div class="home">
    <!-- Banner chính -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-tag">✦ Bộ sưu tập 2026</span>
        <h1 class="hero-title">HÙNG HÀ</h1>
        <p class="hero-sub">"Không mua chịu thua bạn rồi" 😎</p>
        <router-link to="/products" class="btn btn-primary">Xem ngay</router-link>
      </div>
      <div class="hero-overlay"></div>
    </section>

    <!-- Sản phẩm nổi bật -->
    <section class="featured">
      <div class="section-header">
        <h2>🔥 Sản phẩm hot</h2>
        <p class="section-desc">Mấy món này bán chạy lắm rồi đó</p>
      </div>
      <div class="product-grid" v-if="!productsStore.loading">
        <ProductCard 
          v-for="product in productsStore.products.slice(0, 8)" 
          :key="product.id"
          :product="product"
        />
      </div>
      <div v-else class="loading">Đang tải...</div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const productsStore = useProductsStore()

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<style scoped>
.home {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 28px;
}
.hero {
  position: relative;
  background: linear-gradient(160deg, #0a0a0a 0%, #1a1816 40%, #0a0a0a 100%);
  border-radius: 12px;
  padding: 120px 40px;
  text-align: center;
  margin-bottom: 60px;
  overflow: hidden;
  border: 1px solid rgba(255, 248, 240, 0.05);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, rgba(212, 175, 55, 0.06) 0%, transparent 60%);
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.hero-tag {
  display: inline-block;
  color: var(--accent);
  font-size: 14px;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: 600;
}
.hero-title {
  font-size: 80px;
  font-weight: 800;
  letter-spacing: 16px;
  background: linear-gradient(to right, #f5f5f5, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.hero-sub {
  font-size: 20px;
  color: var(--text-muted);
  letter-spacing: 4px;
  margin-bottom: 36px;
  font-style: italic;
}
.section-header {
  text-align: center;
  margin-bottom: 8px;
}
.section-header h2 {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 4px;
}
.section-desc {
  color: var(--text-muted);
  font-size: 16px;
  font-style: italic;
  letter-spacing: 2px;
}
</style>