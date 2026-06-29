<template>
  <div class="pt-20 max-w-6xl mx-auto px-6">
    <h1 class="text-3xl font-bold tracking-widest text-center uppercase">📞 Liên hệ</h1>
    
    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6">
        <h3 class="text-xl font-bold text-light tracking-wide">✦ HÙNG HÀ</h3>
        <div class="mt-4 space-y-2 text-muted">
          <p><strong class="text-light">📍 Địa chỉ:</strong> Hà Nội</p>
          <p><strong class="text-light">📞 Điện thoại:</strong> 0348***711</p>
          <p><strong class="text-light">✉ Email:</strong> cutmemaydiy@gmail.com</p>
          <p><strong class="text-light">🕐 Giờ mở cửa:</strong> 8:00 - 21:00</p>
        </div>
        <div class="flex gap-4 mt-4">
          <a href="#" class="text-muted hover:text-gold transition">📘 Facebook</a>
          <a href="#" class="text-muted hover:text-gold transition">📸 Instagram</a>
          <a href="#" class="text-muted hover:text-gold transition">🎵 TikTok</a>
        </div>
      </div>

      <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg p-6">
        <h3 class="text-xl font-bold text-light tracking-wide">Gửi tin nhắn</h3>
        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div>
            <label class="block text-light text-sm font-semibold">Họ tên</label>
            <input type="text" v-model="form.name" placeholder="Nhập họ tên" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">Email</label>
            <input type="email" v-model="form.email" placeholder="Nhập email" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">Chủ đề</label>
            <input type="text" v-model="form.subject" placeholder="Chủ đề" required
                   class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-light text-sm font-semibold">Nội dung</label>
            <textarea v-model="form.message" rows="4" placeholder="Nhập tin nhắn..." required
                      class="w-full bg-dark2 border border-white/10 rounded-lg px-4 py-3 text-light placeholder-muted focus:border-gold focus:outline-none resize-none"></textarea>
          </div>
          <button type="submit" class="bg-gold text-dark w-full py-3 rounded hover:bg-goldHover transition-all font-semibold tracking-wider">Gửi</button>
          <p v-if="successMessage" class="text-gold text-center italic mt-2">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({ name: '', email: '', subject: '', message: '' })
const successMessage = ref('')

const handleSubmit = async () => {
  try {
    await axios.post('/api/contact', {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    })

    successMessage.value = 'Gửi tin nhắn thành công! Cảm ơn bạn đã liên hệ.'
    form.value = { name: '', email: '', subject: '', message: '' }

    setTimeout(() => { successMessage.value = '' }, 4000)
  } catch (error) {
    alert(error.response?.data?.message || 'Gửi thất bại, vui lòng thử lại')
  }
}
</script>