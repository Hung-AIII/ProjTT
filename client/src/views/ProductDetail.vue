<template>
  <div class="pt-20 max-w-6xl mx-auto px-6">
    <div v-if="product" class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-8 grid md:grid-cols-2 gap-12">
      <img :src="product.image" :alt="product.name" class="w-full h-[500px] object-cover rounded" />
      <div>
        <span class="text-gold text-sm tracking-widest uppercase">{{ product.category }}</span>
        <h1 class="text-3xl font-bold text-light mt-1">{{ product.name }}</h1>
        <p class="text-gold text-3xl font-bold mt-2">{{ formatPrice(product.price) }}</p>
        <p class="text-muted italic mt-4">{{ product.description || 'Hàng đẹp, chất lượng, giá tốt.' }}</p>

        <!-- Tồn kho -->
        <p class="mt-3 text-sm" :class="product.stock > 0 ? 'text-muted' : 'text-red-500 font-semibold'">
          {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : '⚠ Hết hàng' }}
        </p>

        <div v-if="product.stock > 0" class="flex items-center gap-4 mt-4">
          <label class="text-light font-semibold">Số lượng</label>
          <button @click="decreaseQuantity" class="w-9 h-9 border border-white/10 rounded-full hover:border-gold hover:text-gold transition">−</button>
          <span class="text-xl font-bold w-10 text-center">{{ quantity }}</span>
          <button @click="increaseQuantity" class="w-9 h-9 border border-white/10 rounded-full hover:border-gold hover:text-gold transition">+</button>
        </div>

        <button 
          @click="addToCart" 
          :disabled="product.stock <= 0"
          :class="product.stock > 0 ? 'bg-gold hover:bg-goldHover cursor-pointer' : 'bg-white/10 cursor-not-allowed opacity-50'"
          class="text-dark w-full py-3 rounded transition-all font-semibold tracking-wider mt-6">
          {{ product.stock > 0 ? '🛒 Thêm vào giỏ' : '⚠ Hết hàng' }}
        </button>
        <router-link to="/products" class="block text-muted hover:text-gold transition text-center mt-3 italic">← Quay lại cửa hàng</router-link>
      </div>
    </div>
    <div v-else-if="loading" class="text-muted text-center py-20 italic">Đang tải...</div>
    <div v-else class="text-muted text-center py-20 italic">Không tìm thấy sản phẩm.</div>
  </div>
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

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const increaseQuantity = () => {
  if (quantity.value < (product.value?.stock || 1)) quantity.value++
}
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  if (!product.value || product.value.stock <= 0) return
  cartStore.addToCart(product.value, quantity.value)
  alert('Đã bỏ vào giỏ hàng! 🛒')
}

onMounted(async () => {
  const id = route.params.id
  try {
    // ✅ Gọi API thật thay vì chỉ tìm trong store local
    const data = await productsStore.fetchProductById(id)
    if (data) product.value = data
    else router.push('/products')
  } catch {
    router.push('/products')
  } finally {
    loading.value = false
  }
})
</script>