<template>
  <div class="product-detail" v-if="product">
    <div class="detail-container glass-card">
      <div class="detail-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="detail-info">
        <span class="category">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <p class="description">{{ product.description || 'Hàng đẹp, chất lượng, giá tốt.' }}</p>
        <div class="quantity-control">
          <label>Số lượng</label>
          <button @click="decreaseQuantity" class="qty-btn">−</button>
          <span class="qty-number">{{ quantity }}</span>
          <button @click="increaseQuantity" class="qty-btn">+</button>
        </div>
        <button @click="addToCart" class="btn btn-primary btn-full">🛒 Thêm vào giỏ</button>
        <router-link to="/products" class="btn-back">← Quay lại cửa hàng</router-link>
      </div>
    </div>
  </div>
  <div v-else-if="loading" class="loading">Đang tải...</div>
  <div v-else class="not-found">Không tìm thấy sản phẩm.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const increaseQuantity = () => { quantity.value++ }
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  alert('Đã bỏ vào giỏ hàng!')
}

onMounted(async () => {
  const id = route.params.id
  try {
    const data = await productsStore.fetchProductById(id)
    if (data) product.value = data
    else router.push('/products')
  } catch (error) { router.push('/products') }
  finally { loading.value = false }
})
</script>

<style scoped>
.product-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 28px;
}
.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding: 40px;
}
.detail-image img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-radius: 4px;
}
.detail-info h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.category {
  display: inline-block;
  color: var(--accent);
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.price {
  font-size: 28px;
  color: var(--accent);
  font-weight: 700;
  margin: 12px 0 16px;
}
.description {
  color: var(--text-muted);
  font-size: 16px;
  font-style: italic;
  margin-bottom: 24px;
  line-height: 1.8;
}
.quantity-control {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.quantity-control label {
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 15px;
}
.qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: 50%;
  font-size: 18px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}
.qty-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.qty-number {
  font-size: 20px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
}
.btn-full {
  width: 100%;
  margin-bottom: 12px;
}
.btn-back {
  display: inline-block;
  color: var(--text-muted);
  transition: color 0.3s;
  font-style: italic;
  letter-spacing: 1px;
}
.btn-back:hover {
  color: var(--accent);
}
.not-found {
  text-align: center;
  padding: 80px 20px;
  font-size: 20px;
  color: var(--text-muted);
  font-style: italic;
}
</style>