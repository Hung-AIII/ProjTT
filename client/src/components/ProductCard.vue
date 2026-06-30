<template>
  <div class="relative bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-gold/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 group">

    <!-- Ảnh sản phẩm -->
    <router-link :to="`/products/${product._id || product.id}`" class="block relative overflow-hidden aspect-[4/5]">
      <img :src="product.image" :alt="product.name"
           class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

      <!-- Lớp phủ tối khi hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
        <span class="text-gold border border-gold px-5 py-2 text-xs tracking-[0.2em] uppercase bg-dark/70 backdrop-blur-sm rounded-full">
          Xem chi tiết →
        </span>
      </div>

      <!-- Badge danh mục -->
      <span class="absolute top-3 left-3 bg-gold text-dark text-[11px] px-3 py-1 rounded-full font-bold tracking-wider uppercase shadow-lg">
        {{ product.category }}
      </span>

      <!-- Badge sao đánh giá (nếu có review) -->
      <span v-if="product.numReviews > 0"
            class="absolute top-3 right-3 bg-dark/80 backdrop-blur-sm text-gold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
        ★ {{ product.averageRating?.toFixed(1) }}
      </span>

      <!-- Badge sắp hết hàng -->
      <span v-if="product.stock > 0 && product.stock <= 5"
            class="absolute bottom-3 left-3 bg-yellow-500/90 text-dark text-[11px] px-2.5 py-1 rounded-full font-bold tracking-wide">
        🔥 Sắp hết
      </span>
    </router-link>

    <!-- Thông tin sản phẩm -->
    <div class="p-4">
      <router-link :to="`/products/${product._id || product.id}`" class="block">
        <h3 class="text-light font-semibold leading-snug line-clamp-2 min-h-[2.6em] hover:text-gold transition">
          {{ product.name }}
        </h3>
      </router-link>

      <div class="flex items-center justify-between mt-2">
        <p class="text-gold text-lg font-bold">{{ formatPrice(product.price) }}</p>
        <p v-if="product.numReviews > 0" class="text-muted text-xs">
          {{ product.numReviews }} đánh giá
        </p>
      </div>

      <!-- Tồn kho -->
      <p class="text-xs mt-1.5" :class="product.stock > 0 ? 'text-muted' : 'text-red-500 font-semibold'">
        {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : '⚠ Hết hàng' }}
      </p>

      <!-- Nút thêm vào giỏ -->
      <button
        @click="addToCart"
        :disabled="product.stock <= 0"
        :class="[
          'w-full mt-3 rounded-lg transition-all text-sm py-2.5 font-medium tracking-wide',
          product.stock > 0
            ? 'bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-dark cursor-pointer'
            : 'border border-white/10 text-muted cursor-not-allowed opacity-50'
        ]"
      >
        {{ product.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const addToCart = () => {
  if (!props.product || props.product.stock <= 0) return
  cartStore.addToCart(props.product, 1)
}
</script>