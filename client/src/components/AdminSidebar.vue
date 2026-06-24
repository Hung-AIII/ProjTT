<template>
  <div class="bg-dark2 border-r border-white/5 p-6 min-h-screen w-56">
    <h3 class="text-gold text-xl font-bold tracking-widest mb-6">✦ HÙNG HÀ</h3>
    <ul class="space-y-1">
      <li>
        <router-link to="/admin" class="text-muted hover:text-gold transition block px-3 py-2 rounded hover:bg-gold/10">📊 Tổng quan</router-link>
      </li>
      <li>
        <router-link to="/admin/products" class="text-muted hover:text-gold transition block px-3 py-2 rounded hover:bg-gold/10">📦 Sản phẩm</router-link>
      </li>
      <li>
        <router-link to="/admin/orders" class="text-muted hover:text-gold transition block px-3 py-2 rounded hover:bg-gold/10">📋 Đơn hàng</router-link>
      </li>
    </ul>
  </div>
</template>