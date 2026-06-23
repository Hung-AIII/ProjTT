<template>
  <div class="product-card glass-card">
    <router-link :to="`/products/${product.id}`" class="image-link">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <div class="image-overlay">
        <span>View Details</span>
      </div>
      <span class="badge">{{ product.category }}</span>
    </router-link>
    <div class="info">
      <router-link :to="`/products/${product.id}`" class="product-name">
        <h3>{{ product.name }}</h3>
      </router-link>
      <p class="price">{{ formatPrice(product.price) }}</p>
      <button @click="addToCart" class="btn btn-outline btn-sm">Add to Cart</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addToCart(props.product)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
</script>

<style scoped>
.product-card {
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 248, 240, 0.06);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.4s ease;
}
.product-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7);
}
.image-link {
  display: block;
  position: relative;
  overflow: hidden;
}
.product-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.product-card:hover img {
  transform: scale(1.04);
}
.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--accent);
  color: var(--primary);
  padding: 4px 14px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 4px;
  font-weight: 700;
}
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s ease;
}
.image-overlay span {
  color: var(--accent);
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1.5px solid var(--accent);
  padding: 10px 28px;
  border-radius: 4px;
  font-weight: 600;
}
.product-card:hover .image-overlay {
  opacity: 1;
}
.info {
  padding: 20px 22px 24px;
}
.product-name {
  text-decoration: none;
}
.product-name h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-light);
  transition: color 0.3s;
  letter-spacing: 0.5px;
}
.product-name:hover h3 {
  color: var(--accent);
}
.price {
  color: var(--accent);
  font-weight: 700;
  font-size: 19px;
  margin: 10px 0 14px;
  letter-spacing: 0.5px;
}
.btn-sm {
  padding: 10px 20px;
  font-size: 13px;
  width: 100%;
  letter-spacing: 1.5px;
}
</style>