<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-icon">✦</span>
          <span class="logo-text">HÙNG HÀ</span>
          <p>"Không mua chịu thua bạn rồi" 😎</p>
        </div>
        <div class="footer-links">
          <router-link to="/">Trang chủ</router-link>
          <router-link to="/products">Sản phẩm</router-link>
          <router-link to="/contact">Liên hệ</router-link>
        </div>
        <div class="footer-contact">
          <p>📞 0348***711</p>
          <p>✉ cutmemaydiy@gmail.com</p>
          <p>📍 Hà Nội</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 HÙNG HÀ - Thời trang cho người sành điệu</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--secondary);
  border-top: 1px solid rgba(255, 248, 240, 0.05);
  padding: 48px 0 24px;
  margin-top: 60px;
}
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}
.footer-brand .logo-icon {
  color: var(--accent);
  font-size: 28px;
}
.footer-brand .logo-text {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 4px;
}
.footer-brand p {
  color: var(--text-muted);
  margin-top: 6px;
  font-size: 15px;
  font-style: italic;
  letter-spacing: 0.5px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-links a {
  color: var(--text-muted);
  transition: color 0.3s;
  font-size: 15px;
  letter-spacing: 1px;
}
.footer-links a:hover {
  color: var(--accent);
}
.footer-contact p {
  color: var(--text-muted);
  font-size: 15px;
  margin: 4px 0;
  letter-spacing: 0.5px;
}
.footer-bottom {
  border-top: 1px solid rgba(255, 248, 240, 0.05);
  padding-top: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  letter-spacing: 1px;
}
</style>