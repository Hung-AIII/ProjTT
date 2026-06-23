<template>
  <div class="admin-sidebar">
    <h3>✦ HÙNG HÀ</h3>
    <ul>
      <li><router-link to="/admin">📊 Tổng quan</router-link></li>
      <li><router-link to="/admin/products">📦 Sản phẩm</router-link></li>
      <li><router-link to="/admin/orders">📋 Đơn hàng</router-link></li>
    </ul>
  </div>
</template>

<style scoped>
.admin-sidebar {
  background: var(--secondary);
  border-right: 1px solid var(--border-dark);
  padding: 28px 20px;
  min-height: 80vh;
  width: 220px;
}
.admin-sidebar h3 {
  color: var(--accent);
  font-size: 20px;
  letter-spacing: 3px;
  margin-bottom: 28px;
}
.admin-sidebar ul {
  list-style: none;
  padding: 0;
}
.admin-sidebar li {
  margin: 4px 0;
}
.admin-sidebar a {
  color: var(--text-muted);
  text-decoration: none;
  display: block;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 15px;
  letter-spacing: 1px;
  transition: all 0.3s;
}
.admin-sidebar a:hover {
  background: rgba(212, 175, 55, 0.08);
  color: var(--accent);
}
.admin-sidebar a.router-link-active {
  background: rgba(212, 175, 55, 0.12);
  color: var(--accent);
}
</style>