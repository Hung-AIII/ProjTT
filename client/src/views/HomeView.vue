<template>
  <div class="pt-16 overflow-x-hidden">

    <!-- ===== HERO SLIDER ===== -->
    <section class="relative h-[90vh] min-h-[560px] overflow-hidden">
      <TransitionGroup name="slide">
        <div v-for="(slide, i) in slides" :key="slide.id" v-show="currentSlide === i"
             class="absolute inset-0">
          <img :src="slide.image" :alt="slide.title"
               class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div class="absolute inset-0 flex items-center">
            <div class="max-w-7xl mx-auto px-8 sm:px-16">
              <p class="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4 opacity-0 animate-fadeUp" style="animation-delay:0.1s">{{ slide.sub }}</p>
              <h2 class="text-5xl sm:text-7xl font-extrabold text-light leading-tight tracking-[0.15em] opacity-0 animate-fadeUp" style="animation-delay:0.25s">
                {{ slide.title }}
              </h2>
              <p class="text-muted text-lg mt-4 max-w-md opacity-0 animate-fadeUp" style="animation-delay:0.4s">{{ slide.desc }}</p>
              <router-link :to="slide.link"
                           class="inline-block mt-8 bg-gold text-dark px-8 py-3.5 rounded-full font-semibold tracking-wider hover:bg-goldHover hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all opacity-0 animate-fadeUp"
                           style="animation-delay:0.55s">
                {{ slide.cta }}
              </router-link>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Điều hướng slide -->
      <button @click="prevSlide"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 border border-white/20 text-light hover:bg-gold hover:text-dark hover:border-gold transition flex items-center justify-center">
        ‹
      </button>
      <button @click="nextSlide"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 border border-white/20 text-light hover:bg-gold hover:text-dark hover:border-gold transition flex items-center justify-center">
        ›
      </button>

      <!-- Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <button v-for="(_, i) in slides" :key="i" @click="currentSlide = i"
                :class="[
                  'rounded-full transition-all duration-300',
                  currentSlide === i ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                ]" />
      </div>
    </section>

    <!-- ===== THÔNG TIN NHANH ===== -->
    <section class="bg-gold text-dark py-3 overflow-hidden">
      <div class="flex gap-16 animate-marquee whitespace-nowrap">
        <span v-for="item in marqueeItems" :key="item" class="text-sm font-semibold tracking-wider uppercase">
          ✦ {{ item }}
        </span>
        <!-- Lặp lại để marquee mượt -->
        <span v-for="item in marqueeItems" :key="'dup-' + item" class="text-sm font-semibold tracking-wider uppercase">
          ✦ {{ item }}
        </span>
      </div>
    </section>

    <!-- ===== GIỚI THIỆU THƯƠNG HIỆU ===== -->
    <section class="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p class="text-gold text-xs tracking-[0.35em] uppercase font-semibold mb-3">Câu chuyện của chúng tôi</p>
        <h2 class="text-4xl font-extrabold text-light tracking-wider leading-tight">
          Thời trang không chỉ là<br/>
          <span class="text-gold">quần áo.</span><br/>
          Đó là cách bạn kể<br/>chuyện về mình.
        </h2>
        <p class="text-muted leading-relaxed mt-6 text-base">
          Hùng Hà ra đời từ niềm tin rằng phong cách cá nhân là hình thức biểu đạt mạnh mẽ nhất. Chúng tôi chọn lọc từng sản phẩm với tiêu chí khắt khe — không chỉ về chất lượng vải vóc, mà còn về câu chuyện và cảm xúc mà nó mang lại.
        </p>
        <p class="text-muted leading-relaxed mt-3 text-base">
          Từ một tiệm nhỏ tại Hà Nội, Hùng Hà đã phục vụ hàng nghìn khách hàng yêu thời trang trên toàn quốc — những người hiểu rằng mặc đẹp không phải là xa xỉ, mà là sự tự tôn trọng bản thân.
        </p>
        <router-link to="/products"
                     class="inline-flex items-center gap-2 mt-8 text-gold font-semibold hover:gap-4 transition-all">
          Khám phá bộ sưu tập →
        </router-link>
      </div>
      <div class="relative">
        <img src="https://picsum.photos/seed/brand/600/700" alt="Hùng Hà Brand"
             class="w-full h-[420px] object-cover rounded-2xl shadow-2xl shadow-black/60" />
        <div class="absolute -bottom-5 -left-5 bg-gold text-dark px-6 py-4 rounded-xl shadow-lg">
          <p class="text-3xl font-extrabold leading-none">2018</p>
          <p class="text-xs font-semibold mt-0.5 uppercase tracking-wider">Thành lập</p>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 border-4 border-gold/30 rounded-full"></div>
      </div>
    </section>

    <!-- ===== SỐ LIỆU ===== -->
    <section class="bg-dark3/60 border-y border-white/5 py-16">
      <div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-4xl font-extrabold text-gold">{{ stat.value }}</p>
          <p class="text-muted text-sm mt-1 tracking-wider uppercase">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ===== CAM KẾT ===== -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-14">
        <p class="text-gold text-xs tracking-[0.35em] uppercase font-semibold mb-2">Tại sao chọn chúng tôi</p>
        <h2 class="text-3xl font-bold text-light tracking-wider">Cam kết của Hùng Hà</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="item in commitments" :key="item.title"
             class="group bg-dark3/60 border border-white/5 rounded-2xl p-6 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300 text-center">
          <div class="text-4xl mb-4">{{ item.icon }}</div>
          <h3 class="text-light font-bold tracking-wide mb-2">{{ item.title }}</h3>
          <p class="text-muted text-sm leading-relaxed">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== GALLERY ẢNH SHOP ===== -->
    <section class="max-w-7xl mx-auto px-6 pb-24">
      <div class="text-center mb-10">
        <p class="text-gold text-xs tracking-[0.35em] uppercase font-semibold mb-2">Không gian</p>
        <h2 class="text-3xl font-bold text-light tracking-wider">Cửa hàng của chúng tôi</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="(img, i) in galleryImages" :key="i"
             :class="['overflow-hidden rounded-xl', i === 0 ? 'row-span-2' : '']">
          <img :src="img" alt="Cửa hàng Hùng Hà"
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
               :class="i === 0 ? 'h-full min-h-[320px]' : 'h-44'" />
        </div>
      </div>
    </section>

    <!-- ===== CTA CUỐI TRANG ===== -->
    <section class="relative bg-gradient-to-br from-dark via-dark2 to-dark border-t border-white/5 py-24 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-20"
           style="background: radial-gradient(ellipse at center, #b8960c 0%, transparent 70%)"></div>
      <div class="relative z-10 max-w-2xl mx-auto px-6">
        <p class="text-gold text-xs tracking-[0.4em] uppercase font-semibold mb-4">✦ Bộ sưu tập 2026</p>
        <h2 class="text-5xl sm:text-6xl font-extrabold tracking-[0.2em] bg-gradient-to-r from-light to-gold bg-clip-text text-transparent">
          HÙNG HÀ
        </h2>
        <p class="text-muted text-lg italic mt-3">"Không mua chịu thua bạn rồi" 😎</p>
        <router-link to="/products"
                     class="inline-block mt-8 bg-gold text-dark px-10 py-4 rounded-full hover:bg-goldHover transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/30 font-semibold tracking-widest">
          Mua sắm ngay
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ===== SLIDER =====
const currentSlide = ref(0)
let autoSlide = null

const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/fashion1/1600/900',
    sub: 'Bộ sưu tập 2026',
    title: 'HÙNG HÀ',
    desc: 'Thời trang không chỉ là quần áo — đó là cách bạn kể chuyện về bản thân.',
    cta: 'Khám phá ngay',
    link: '/products',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/fashion2/1600/900',
    sub: 'Phong cách mới',
    title: 'ĐẶT RIÊNG\nMỘT DẤU ẤN',
    desc: 'Hàng trăm mẫu áo, quần, giày dép và phụ kiện cao cấp đang chờ bạn.',
    cta: 'Xem sản phẩm',
    link: '/products',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/fashion3/1600/900',
    sub: 'Chất lượng đỉnh cao',
    title: 'TỰ TIN\nMỖI NGÀY',
    desc: 'Chọn lọc kỹ từng sản phẩm. Chúng tôi cam kết chất lượng và phong cách.',
    cta: 'Liên hệ với chúng tôi',
    link: '/contact',
  },
]

const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % slides.length }
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length }

onMounted(() => { autoSlide = setInterval(nextSlide, 5000) })
onUnmounted(() => clearInterval(autoSlide))

// ===== MARQUEE =====
const marqueeItems = [
  'Miễn phí vận chuyển đơn từ 500K',
  'Hàng chính hãng 100%',
  'Đổi trả trong 7 ngày',
  'Thanh toán khi nhận hàng',
  'Hỗ trợ 8:00 - 21:00 mỗi ngày',
]

// ===== SỐ LIỆU =====
const stats = [
  { value: '5.000+', label: 'Khách hàng hài lòng' },
  { value: '200+', label: 'Mẫu sản phẩm' },
  { value: '7+', label: 'Năm kinh nghiệm' },
  { value: '4.8★', label: 'Đánh giá trung bình' },
]

// ===== CAM KẾT =====
const commitments = [
  {
    icon: '👑',
    title: 'Chất lượng cao cấp',
    desc: 'Mỗi sản phẩm đều được chọn lọc kỹ lưỡng về chất liệu và đường may.',
  },
  {
    icon: '🚚',
    title: 'Giao hàng nhanh',
    desc: 'Giao hàng toàn quốc trong 2–4 ngày. Miễn phí vận chuyển từ 500.000đ.',
  },
  {
    icon: '🔄',
    title: 'Đổi trả dễ dàng',
    desc: 'Không vừa ý? Đổi trả miễn phí trong vòng 7 ngày kể từ ngày nhận hàng.',
  },
  {
    icon: '💬',
    title: 'Hỗ trợ tận tâm',
    desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn từ 8:00 đến 21:00 mỗi ngày.',
  },
]

// ===== GALLERY =====
const galleryImages = [
  'https://picsum.photos/seed/store1/600/800',
  'https://picsum.photos/seed/store2/400/350',
  'https://picsum.photos/seed/store3/400/350',
  'https://picsum.photos/seed/store4/400/350',
  'https://picsum.photos/seed/store5/400/350',
]
</script>

<style scoped>
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
  position: absolute;
  inset: 0;
}
.slide-enter-from { opacity: 0; transform: scale(1.03); }
.slide-leave-to  { opacity: 0; transform: scale(0.98); }

/* Fade up cho text trong hero */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeUp {
  animation: fadeUp 0.6s ease forwards;
}

/* Marquee chạy liên tục */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
}
</style>