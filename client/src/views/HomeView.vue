<template>
  <div class="pt-20">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-dark via-dark2 to-dark rounded-xl p-20 text-center overflow-hidden border border-white/5 mb-16">
      <div class="absolute inset-0 bg-gradient-radial from-gold/5 to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <span class="text-gold text-sm tracking-[0.3em] uppercase font-semibold">✦ Bộ sưu tập 2026</span>
        <h1 class="text-7xl font-extrabold tracking-[0.3em] bg-gradient-to-r from-light to-gold bg-clip-text text-transparent mt-2">HÙNG HÀ</h1>
        <p class="text-muted text-xl italic tracking-wider mt-2">"Không mua chịu thua bạn rồi" 😎</p>
        <router-link to="/products" class="inline-block bg-gold text-dark px-8 py-4 rounded hover:bg-goldHover transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 font-semibold tracking-wider mt-6">Xem ngay</router-link>
      </div>
    </section>

    <!-- Featured -->
    <section>
      <h2 class="text-3xl font-bold tracking-widest text-center uppercase">🔥 Sản phẩm hot</h2>
      <p class="text-muted text-center italic tracking-wide mt-1">Mấy món này bán chạy lắm rồi đó</p>
      <div v-if="!productsStore.loadingList" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <ProductCard v-for="product in productsStore.products.slice(0, 8)" :key="product.id" :product="product" />
      </div>
      <div v-else class="text-muted text-center py-12 italic">Đang tải...</div>
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