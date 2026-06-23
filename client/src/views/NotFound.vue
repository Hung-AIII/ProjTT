<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>❌ Lạc đường rồi!</h2>
      <p>Trang bạn tìm không có hoặc đã đi đâu mất.</p>
      <router-link to="/" class="btn btn-primary">Về trang chủ</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}
.not-found-content {
  text-align: center;
  padding: 60px;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(16px);
  border-radius: 8px;
  border: 1px solid rgba(255, 248, 240, 0.06);
}
.not-found-content h1 {
  font-size: 80px;
  color: var(--accent);
  margin: 0;
}
.not-found-content h2 {
  font-size: 28px;
  color: var(--text-light);
  margin: 10px 0;
}
.not-found-content p {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 25px;
  font-style: italic;
}
</style>