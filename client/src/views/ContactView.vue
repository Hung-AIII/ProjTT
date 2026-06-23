<template>
  <div class="contact-page">
    <h1>📞 Liên hệ</h1>
    
    <div class="contact-container">
      <div class="contact-info glass-card">
        <h3>✦ HÙNG HÀ</h3>
        <p><strong>📍 Địa chỉ:</strong> Hà Nội</p>
        <p><strong>📞 Điện thoại:</strong> 0348***711</p>
        <p><strong>✉ Email:</strong> cutmemaydiy@gmail.com</p>
        <p><strong>🕐 Giờ mở cửa:</strong> Tự thêm</p>
        <div class="social-links">
          <a href="#" class="social-link">📘 Facebook</a>
          <a href="#" class="social-link">📸 Instagram</a>
          <a href="#" class="social-link">🎵 TikTok</a>
        </div>
      </div>

      <div class="contact-form glass-card">
        <h3>Gửi tin nhắn</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Họ tên</label>
            <input type="text" v-model="form.name" placeholder="Nhập họ tên" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" placeholder="Nhập email" required />
          </div>
          <div class="form-group">
            <label>Chủ đề</label>
            <input type="text" v-model="form.subject" placeholder="Chủ đề" required />
          </div>
          <div class="form-group">
            <label>Nội dung</label>
            <textarea v-model="form.message" rows="4" placeholder="Nhập tin nhắn..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Gửi</button>
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const successMessage = ref('')

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
  successMessage.value = 'Đã gửi! Shop sẽ phản hồi sớm nhất có thể.'
  form.value = { name: '', email: '', subject: '', message: '' }
  setTimeout(() => { successMessage.value = '' }, 5000)
}
</script>

<style scoped>
.contact-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 28px;
}
.contact-page h1 {
  font-size: 34px;
  text-align: center;
  letter-spacing: 6px;
  margin-bottom: 32px;
  font-weight: 700;
}
.contact-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 32px;
}
.contact-info, .contact-form {
  padding: 32px 28px;
}
.contact-info h3, .contact-form h3 {
  font-size: 22px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}
.contact-info p {
  margin: 8px 0;
  color: var(--text-muted);
  font-size: 15px;
}
.contact-info strong {
  color: var(--text-light);
  font-weight: 600;
}
.social-links {
  margin-top: 16px;
  display: flex;
  gap: 16px;
}
.social-link {
  color: var(--text-muted);
  letter-spacing: 1px;
  font-size: 14px;
  transition: color 0.3s;
}
.social-link:hover {
  color: var(--accent);
}
.btn-full {
  width: 100%;
}
.success {
  color: var(--accent);
  text-align: center;
  margin-top: 14px;
  font-style: italic;
}
</style>