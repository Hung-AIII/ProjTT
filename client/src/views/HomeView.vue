<template>
  <div class="home-root">

    <!-- ===== HERO: BILLBOARD TYPOGRAPHY ===== -->
    <section class="hero">
      <div class="hero-eyebrow">
        <span class="eyebrow-line"></span>
        <span class="eyebrow-text">Bộ sưu tập 2026</span>
        <span class="eyebrow-line"></span>
      </div>

      <div class="hero-title-wrap">
        <div class="hero-title-shadow" aria-hidden="true">HÙNG HÀ</div>
        <h1 class="hero-title">HÙNG HÀ</h1>
      </div>

      <div class="hero-bottom">
        <p class="hero-tagline">"Không mua chịu thua bạn rồi" 😎</p>
        <router-link to="/products" class="hero-cta">
          <span>Khám phá ngay</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </router-link>
      </div>

      <!-- Góc trang trí -->
      <div class="hero-corner hero-corner--tl"></div>
      <div class="hero-corner hero-corner--br"></div>
      <div class="hero-year">EST. 2018</div>
    </section>

    <!-- ===== MARQUEE ===== -->
    <div class="marquee-wrap">
      <div class="marquee-track">
        <span v-for="(item, i) in [...marquee, ...marquee]" :key="i" class="marquee-item">
          <span class="marquee-dot">✦</span> {{ item }}
        </span>
      </div>
    </div>

    <!-- ===== CATEGORY GRID ===== -->
    <section class="cat-section">
      <div class="section-header">
        <p class="section-label">Danh mục</p>
        <h2 class="section-title">Phong cách của bạn<br/>bắt đầu từ đây</h2>
      </div>
      <div class="cat-grid">
        <router-link
          v-for="cat in categories"
          :key="cat.name"
          :to="`/products?category=${encodeURIComponent(cat.name)}`"
          class="cat-card"
          :style="{ '--accent': cat.color }"
        >
          <div class="cat-icon">{{ cat.icon }}</div>
          <div class="cat-info">
            <p class="cat-name">{{ cat.name }}</p>
            <p class="cat-count">{{ cat.count }}</p>
          </div>
          <div class="cat-arrow">→</div>
          <div class="cat-bg"></div>
        </router-link>
      </div>
    </section>

    <!-- ===== BRAND STATEMENT ===== -->
    <section class="statement-section">
      <div class="statement-inner">
        <div class="statement-left">
          <p class="section-label">Triết lý</p>
          <blockquote class="statement-quote">
            Thời trang không phải<br/>
            quần áo bạn mặc —<br/>
            đó là <em>ai bạn là</em>.
          </blockquote>
          <div class="statement-divider"></div>
          <p class="statement-body">
            Hùng Hà được xây dựng từ một niềm tin giản dị: mỗi người đều xứng đáng ăn mặc tốt mà không cần chi quá nhiều. Chúng tôi chọn lọc kỹ, kiểm tra chất lượng thực, và chỉ bán những gì chúng tôi tự hào đặt tên mình lên đó.
          </p>
          <router-link to="/contact" class="statement-link">
            Liên hệ với chúng tôi →
          </router-link>
        </div>
        <div class="statement-right">
          <div class="stat-grid">
            <div v-for="stat in stats" :key="stat.label" class="stat-box">
              <p class="stat-value">{{ stat.value }}</p>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== COMMITMENT ===== -->
    <section class="commit-section">
      <p class="section-label" style="text-align:center; margin-bottom: 3rem;">Cam kết</p>
      <div class="commit-list">
        <div v-for="(item, i) in commits" :key="item.title" class="commit-item">
          <span class="commit-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <p class="commit-title">{{ item.title }}</p>
            <p class="commit-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA CUỐI ===== -->
    <section class="final-cta">
      <div class="final-cta-inner">
        <p class="section-label">Bắt đầu ngay hôm nay</p>
        <h2 class="final-title">160+ sản phẩm<br/>đang chờ bạn.</h2>
        <router-link to="/products" class="final-btn">
          Vào cửa hàng
        </router-link>
      </div>
      <div class="final-deco" aria-hidden="true">SHOP</div>
    </section>

  </div>
</template>

<script setup>
const marquee = [
  'Miễn phí vận chuyển từ 500K',
  'Hàng chính hãng 100%',
  'Đổi trả 7 ngày',
  'COD toàn quốc',
  'Hỗ trợ 8:00 – 21:00',
]

const categories = [
  { name: 'Áo sơ mi', icon: '👔', count: '20 sản phẩm', color: '#b8960c' },
  { name: 'Váy',      icon: '👗', count: '20 sản phẩm', color: '#c084fc' },
  { name: 'Quần',     icon: '👖', count: '20 sản phẩm', color: '#34d399' },
  { name: 'Áo khoác', icon: '🧥', count: '20 sản phẩm', color: '#60a5fa' },
  { name: 'Áo thun',  icon: '👕', count: '20 sản phẩm', color: '#f87171' },
  { name: 'Giày',     icon: '👟', count: '20 sản phẩm', color: '#fb923c' },
  { name: 'Phụ kiện', icon: '👜', count: '20 sản phẩm', color: '#a3e635' },
]

const stats = [
  { value: '5K+',  label: 'Khách hàng' },
  { value: '160+', label: 'Sản phẩm' },
  { value: '7+',   label: 'Năm hoạt động' },
  { value: '4.8★', label: 'Đánh giá TB' },
]

const commits = [
  { title: 'Chất lượng thật',     desc: 'Mỗi sản phẩm đều qua kiểm định thực tế trước khi lên kệ.' },
  { title: 'Giao hàng nhanh',     desc: 'Toàn quốc 2–4 ngày. Miễn phí vận chuyển từ 500.000đ.' },
  { title: 'Đổi trả không lo',    desc: 'Không vừa ý trong 7 ngày — đổi ngay, không hỏi nhiều.' },
  { title: 'Hỗ trợ tận tâm',      desc: 'Đội ngũ online 8:00–21:00 mỗi ngày, phản hồi trong 15 phút.' },
]
</script>

<style scoped>
/* ── ROOT ─────────────────────────────────── */
.home-root {
  overflow-x: hidden;
}

/* ── HERO ─────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 4rem 4rem;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.eyebrow-line {
  flex: 1;
  height: 1px;
  background: rgba(184,150,12,0.4);
  max-width: 80px;
}
.eyebrow-text {
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #b8960c;
  font-weight: 600;
  white-space: nowrap;
}

.hero-title-wrap {
  position: relative;
  line-height: 0.85;
  margin-bottom: 3rem;
  user-select: none;
}
/* Bóng chữ layered — signature element */
.hero-title-shadow {
  position: absolute;
  inset: 0;
  font-size: clamp(5rem, 16vw, 14rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(184,150,12,0.15);
  transform: translate(6px, 6px);
  pointer-events: none;
  white-space: nowrap;
}
.hero-title {
  font-size: clamp(5rem, 16vw, 14rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #f5e27a 0%, #b8960c 40%, #7a5f00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  margin: 0;
  position: relative;
}

.hero-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.hero-tagline {
  color: rgba(255,255,255,0.45);
  font-style: italic;
  font-size: 1rem;
  letter-spacing: 0.03em;
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #b8960c;
  color: #0a0a0a;
  padding: 0.9rem 2rem;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.25s;
}
.hero-cta:hover {
  background: #d4aa14;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184,150,12,0.35);
}

/* Góc trang trí */
.hero-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: rgba(184,150,12,0.3);
  border-style: solid;
}
.hero-corner--tl { top: 5rem; left: 2rem; border-width: 1px 0 0 1px; }
.hero-corner--br { bottom: 2rem; right: 2rem; border-width: 0 1px 1px 0; }

.hero-year {
  position: absolute;
  bottom: 2.5rem;
  left: 4rem;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  color: rgba(255,255,255,0.2);
  text-transform: uppercase;
}

/* ── MARQUEE ──────────────────────────────── */
.marquee-wrap {
  background: #b8960c;
  overflow: hidden;
  padding: 0.75rem 0;
  border-top: none;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.marquee-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0 2.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0a0a0a;
  white-space: nowrap;
}
.marquee-dot { color: rgba(0,0,0,0.4); }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── CATEGORY GRID ────────────────────────── */
.cat-section {
  padding: 6rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 3rem;
}
.section-label {
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #b8960c;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: rgba(255,255,255,0.92);
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
}
.cat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.25rem;
  background: #0d0d0d;
  text-decoration: none;
  overflow: hidden;
  transition: background 0.2s;
  cursor: pointer;
}
.cat-card:hover { background: #111; }
.cat-card:hover .cat-bg {
  opacity: 1;
  transform: scale(1);
}
.cat-card:hover .cat-arrow {
  transform: translateX(4px);
  color: var(--accent);
}

.cat-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 0% 50%, var(--accent) 0%, transparent 65%);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.35s ease;
  pointer-events: none;
}

.cat-icon {
  font-size: 1.8rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.cat-info { flex: 1; position: relative; z-index: 1; }
.cat-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.02em;
}
.cat-count {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
  margin-top: 2px;
  letter-spacing: 0.05em;
}
.cat-arrow {
  font-size: 1rem;
  color: rgba(255,255,255,0.2);
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}

/* ── STATEMENT ────────────────────────────── */
.statement-section {
  padding: 6rem 4rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.statement-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
}
.statement-quote {
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin: 1.5rem 0;
  border: none;
  padding: 0;
}
.statement-quote em {
  font-style: normal;
  color: #b8960c;
  text-decoration: underline;
  text-underline-offset: 5px;
}
.statement-divider {
  width: 40px;
  height: 2px;
  background: #b8960c;
  margin: 1.5rem 0;
}
.statement-body {
  color: rgba(255,255,255,0.45);
  line-height: 1.8;
  font-size: 0.95rem;
}
.statement-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #b8960c;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity 0.2s;
}
.statement-link:hover { opacity: 0.7; }

/* Stats */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
}
.stat-box {
  background: #0d0d0d;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: background 0.2s;
}
.stat-box:hover { background: #111; }
.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #b8960c;
  letter-spacing: -0.02em;
  line-height: 1;
}
.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-top: 0.5rem;
}

/* ── COMMIT ───────────────────────────────── */
.commit-section {
  padding: 6rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}
.commit-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0;
  border: 1px solid rgba(255,255,255,0.06);
}
.commit-item {
  padding: 2.5rem 2rem;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.commit-item:last-child { border-right: none; }
.commit-item:hover { background: rgba(184,150,12,0.04); }

.commit-num {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: #b8960c;
  font-weight: 700;
}
.commit-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.01em;
}
.commit-desc {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.7;
}

/* ── FINAL CTA ────────────────────────────── */
.final-cta {
  position: relative;
  padding: 8rem 4rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  text-align: center;
}
.final-cta-inner {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
}
.final-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  color: rgba(255,255,255,0.9);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 1rem 0 2.5rem;
}
.final-btn {
  display: inline-block;
  background: transparent;
  border: 1px solid #b8960c;
  color: #b8960c;
  padding: 1rem 3rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 2px;
  transition: all 0.25s;
}
.final-btn:hover {
  background: #b8960c;
  color: #0a0a0a;
  box-shadow: 0 0 40px rgba(184,150,12,0.3);
}

/* Chữ nền lớn trang trí */
.final-deco {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  font-size: clamp(8rem, 20vw, 18rem);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(184,150,12,0.07);
  letter-spacing: -0.05em;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

/* ── RESPONSIVE ───────────────────────────── */
@media (max-width: 768px) {
  .hero { padding: 5rem 1.5rem 3rem; }
  .hero-year { left: 1.5rem; }
  .cat-section, .statement-section, .commit-section, .final-cta { padding: 4rem 1.5rem; }
  .statement-inner { grid-template-columns: 1fr; gap: 3rem; }
  .commit-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .commit-item:last-child { border-bottom: none; }
  .hero-title-shadow { display: none; }
}
</style>