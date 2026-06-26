import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import axios from 'axios'

// ✅ Interceptor toàn cục — tự đính token vào mọi request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')