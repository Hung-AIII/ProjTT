<template>
  <div class="p-6 pt-24">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-light tracking-wider">📦 Quản lý sản phẩm</h1>
      <button class="bg-gold text-dark px-4 py-2 rounded hover:bg-goldHover transition-all font-semibold">+ Thêm mới</button>
    </div>
    
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden mt-6">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">ID</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tên</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Danh mục</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Giá</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productsStore.products" :key="product.id" class="border-t border-white/5 hover:bg-white/5">
            <td class="px-4 py-3 text-muted">#{{ product.id }}</td>
            <td class="px-4 py-3 text-light">{{ product.name }}</td>
            <td class="px-4 py-3 text-muted">{{ product.category }}</td>
            <td class="px-4 py-3 text-gold">{{ formatPrice(product.price) }}</td>
            <td class="px-4 py-3">
              <button class="text-gold hover:text-goldHover transition mr-2">✎</button>
              <button class="text-red-500 hover:text-red-400 transition">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '../../stores/products'

const productsStore = useProductsStore()

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
</script>