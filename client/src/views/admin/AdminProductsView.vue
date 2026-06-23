<template>
  <div class="admin-products">
    <h1>Manage Products</h1>
    <button class="btn btn-primary" @click="showAddForm = true">+ Add New</button>
    
    <table class="product-table glass-card">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in productsStore.products" :key="product.id">
          <td>#{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ formatPrice(product.price) }}</td>
          <td>
            <button class="btn-edit">✎</button>
            <button class="btn-delete">✕</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductsStore } from '../../stores/products'

const productsStore = useProductsStore()
const showAddForm = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
</script>

<style scoped>
.admin-products {
  padding: 20px;
}
.admin-products h1 {
  font-size: 28px;
  letter-spacing: 3px;
  font-weight: 700;
  margin-bottom: 20px;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  overflow: hidden;
}
.product-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 14px;
  text-transform: uppercase;
}
.product-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.product-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}
.btn-edit {
  padding: 4px 12px;
  background: var(--accent);
  color: var(--primary);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 6px;
  font-weight: 700;
}
.btn-delete {
  padding: 4px 12px;
  background: transparent;
  color: #c0392b;
  border: 1px solid #c0392b;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 700;
}
.btn-delete:hover {
  background: #c0392b;
  color: white;
}
</style>