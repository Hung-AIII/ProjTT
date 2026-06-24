<template>
  <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden transition-all hover:border-gold/50 hover:shadow-2xl hover:shadow-black/50 group">
    <router-link :to="`/products/${product.id}`" class="block relative overflow-hidden">
      <img :src="product.image" :alt="product.name" class="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105" />
      <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
        <span class="text-gold border border-gold px-6 py-2 text-sm tracking-widest uppercase">Xem chi tiết</span>
      </div>
      <span class="absolute top-3 left-3 bg-gold text-dark text-xs px-3 py-1 rounded font-bold tracking-wider uppercase">{{ product.category }}</span>
    </router-link>
    <div class="p-5">
      <router-link :to="`/products/${product.id}`" class="block">
        <h3 class="text-light font-semibold hover:text-gold transition">{{ product.name }}</h3>
      </router-link>
      <p class="text-gold text-xl font-bold mt-1">{{ formatPrice(product.price) }}</p>
      <button @click="addToCart" class="border border-gold text-light w-full mt-3 rounded hover:bg-gold hover:text-dark transition-all text-sm py-2">Thêm vào giỏ</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()

const addToCart = () => cartStore.addToCart(props.product)
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
</script>