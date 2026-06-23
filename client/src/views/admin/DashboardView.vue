<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <h3>Revenue</h3>
        <p class="stat-number">0đ</p>
      </div>
      <div class="stat-card glass-card">
        <h3>Orders</h3>
        <p class="stat-number">0</p>
      </div>
      <div class="stat-card glass-card">
        <h3>Products</h3>
        <p class="stat-number">{{ productsStore.products.length }}</p>
      </div>
      <div class="stat-card glass-card">
        <h3>Customers</h3>
        <p class="stat-number">0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '../../stores/products'

const productsStore = useProductsStore()
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.dashboard h1 {
  font-size: 28px;
  letter-spacing: 3px;
  font-weight: 700;
  margin-bottom: 28px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}
.stat-card {
  padding: 24px;
  text-align: center;
}
.stat-card h3 {
  color: var(--text-muted);
  font-size: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.stat-number {
  font-size: 34px;
  font-weight: 700;
  color: var(--accent);
}
</style>