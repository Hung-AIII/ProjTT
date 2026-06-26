<template>
  <div class="p-6 pt-24">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-light tracking-wider">💬 Tin nhắn từ khách</h1>
      <span class="bg-red-500/20 text-red-400 text-sm px-3 py-1 rounded-full" v-if="unreadCount > 0">
        {{ unreadCount }} chưa đọc
      </span>
    </div>

    <!-- Danh sách tin nhắn -->
    <div class="mt-6 space-y-4">
      <div v-if="loading" class="text-muted text-center py-12 italic">Đang tải...</div>

      <template v-else-if="contacts.length > 0">
        <div v-for="contact in contacts" :key="contact._id"
             class="bg-dark3/80 border rounded-lg p-5 transition-all cursor-pointer"
             :class="contact.isRead
               ? 'border-white/5 opacity-70'
               : 'border-gold/30 hover:border-gold/50'"
             @click="openContact(contact)">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <!-- Chấm đỏ nếu chưa đọc -->
                <span v-if="!contact.isRead" class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                <p class="text-light font-semibold">{{ contact.name }}</p>
                <span class="text-muted text-xs">{{ contact.email }}</span>
              </div>
              <p class="text-gold text-sm font-medium">{{ contact.subject || 'Không có chủ đề' }}</p>
              <p class="text-muted text-sm mt-1 line-clamp-2">{{ contact.message }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-muted text-xs">{{ formatDate(contact.createdAt) }}</p>
              <span v-if="contact.isRead"
                    class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                ✓ Đã đọc
              </span>
              <span v-else
                    class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                Chưa đọc
              </span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <span class="text-5xl block mb-3">📭</span>
        <p class="text-muted italic">Chưa có tin nhắn nào</p>
      </div>
    </div>

    <!-- Modal xem chi tiết tin nhắn -->
    <div v-if="selectedContact"
         class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
         @click.self="closeContact">
      <div class="bg-dark2 border border-white/10 rounded-lg p-6 w-full max-w-lg">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold text-light">💬 Chi tiết tin nhắn</h2>
          <button @click="closeContact" class="text-muted hover:text-light transition text-xl">✕</button>
        </div>

        <div class="space-y-3">
          <div class="flex gap-2">
            <span class="text-muted text-sm w-20">Từ:</span>
            <span class="text-light font-semibold">{{ selectedContact.name }}</span>
          </div>
          <div class="flex gap-2">
            <span class="text-muted text-sm w-20">Email:</span>
            <a :href="`mailto:${selectedContact.email}`"
               class="text-gold hover:text-goldHover transition">
              {{ selectedContact.email }}
            </a>
          </div>
          <div class="flex gap-2">
            <span class="text-muted text-sm w-20">Chủ đề:</span>
            <span class="text-light">{{ selectedContact.subject || 'Không có' }}</span>
          </div>
          <div class="flex gap-2">
            <span class="text-muted text-sm w-20">Ngày:</span>
            <span class="text-muted text-sm">{{ formatDate(selectedContact.createdAt) }}</span>
          </div>
          <div class="border-t border-white/5 pt-3 mt-3">
            <p class="text-muted text-sm mb-2">Nội dung:</p>
            <p class="text-light bg-dark3/80 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
              {{ selectedContact.message }}
            </p>
          </div>
        </div>

        <!-- Nút trả lời qua email -->
        <div class="flex gap-3 mt-5">
          <a :href="`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Tin nhắn của bạn'}`"
             class="flex-1 bg-gold text-dark py-2 rounded hover:bg-goldHover transition font-semibold text-center text-sm">
            📧 Trả lời qua Email
          </a>
          <button @click="closeContact"
                  class="flex-1 bg-white/10 text-light py-2 rounded hover:bg-white/20 transition text-sm">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const contacts = ref([])
const loading = ref(true)
const selectedContact = ref(null)

const unreadCount = computed(() =>
  contacts.value.filter(c => !c.isRead).length
)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const fetchContacts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/contact')
    contacts.value = response.data
  } catch (error) {
    console.error('Lỗi tải tin nhắn:', error)
  } finally {
    loading.value = false
  }
}

const openContact = async (contact) => {
  selectedContact.value = contact
  // Đánh dấu đã đọc nếu chưa đọc
  if (!contact.isRead) {
    try {
      await axios.put(`/api/contact/${contact._id}/read`)
      contact.isRead = true
    } catch (error) {
      console.error('Lỗi đánh dấu đã đọc:', error)
    }
  }
}

const closeContact = () => {
  selectedContact.value = null
}

onMounted(() => {
  fetchContacts()
})
</script>