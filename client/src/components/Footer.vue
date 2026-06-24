<template>
  <footer class="bg-dark2 border-t border-white/5 mt-20 py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <span class="text-gold text-2xl">✦</span>
          <span class="text-light text-2xl font-bold tracking-[0.2em]">HÙNG HÀ</span>
          <p class="text-muted italic mt-2">"Không mua chịu thua bạn rồi" 😎</p>
        </div>
        <div class="flex flex-col gap-2">
          <router-link to="/" class="text-muted hover:text-gold transition">Trang chủ</router-link>
          <router-link to="/products" class="text-muted hover:text-gold transition">Sản phẩm</router-link>
          <router-link to="/contact" class="text-muted hover:text-gold transition">Liên hệ</router-link>
        </div>
        <div class="text-muted">
          <p>📞 0348***711</p>
          <p>✉ cutmemaydiy@gmail.com</p>
          <p>📍 Hà Nội</p>
        </div>
      </div>
      <div class="border-t border-white/5 pt-4 text-center text-muted text-sm tracking-wide">
        © 2026 HÙNG HÀ - Thời trang cho người sành điệu
      </div>
    </div>
  </footer>
</template>