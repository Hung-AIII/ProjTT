<template>
  <div class="grid grid-cols-[80px_1fr_auto_auto_40px] gap-4 items-center py-4 border-b border-white/5 last:border-0">
    <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
    <div>
      <h3 class="text-light font-semibold">{{ item.name }}</h3>
      <p class="text-muted text-sm">{{ formatPrice(item.price) }}</p>
    </div>
    <div class="flex items-center gap-2">
      <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-7 h-7 border border-white/10 rounded-full hover:border-gold hover:text-gold transition">−</button>
      <span class="w-7 text-center font-bold text-light">{{ item.quantity }}</span>
      <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-7 h-7 border border-white/10 rounded-full hover:border-gold hover:text-gold transition">+</button>
    </div>
    <p class="text-gold font-bold">{{ formatPrice(item.price * item.quantity) }}</p>
    <button @click="removeItem(item.id)" class="text-muted hover:text-red-500 transition text-xl">✕</button>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['update', 'remove'])

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const updateQuantity = (id, qty) => emit('update', id, qty)
const removeItem = (id) => emit('remove', id)
</script>