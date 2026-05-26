<!-- ============================================
     VIEWS/HOMEVIEW.VUE - Halaman Utama
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="home">
    <!-- HERO -->
    <div class="hero">
      <div class="hero-badge">🌱 Platform Ramah Lingkungan</div>
      <h1>Sewa Elektronik Bekas,<br><span>Hemat & Berkelanjutan</span></h1>
      <p>Kurangi limbah elektronik dengan menyewa, bukan membeli. Temukan ribuan alat elektronik berkualitas dari sesama pengguna.</p>
      <div class="hero-actions">
        <RouterLink to="/items" class="btn btn-primary">🔍 Jelajahi Barang</RouterLink>
        <RouterLink to="/login" class="btn btn-ghost">🚀 Mulai Sekarang</RouterLink>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-num">{{ totalBarang }}+</div>
        <div class="stat-lbl">Barang Tersedia</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">100%</div>
        <div class="stat-lbl">Aman & Terverifikasi</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">24/7</div>
        <div class="stat-lbl">Layanan Aktif</div>
      </div>
    </div>

    <!-- FEATURES -->
    <div class="section">
      <h2 class="section-title">Mengapa Eco-Share?</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.icon">
          <div class="feature-icon">{{ f.icon }}</div>
          <div class="feature-title">{{ f.title }}</div>
          <div class="feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const API = 'http://localhost:3000/api'
const totalBarang = ref(0)

const features = [
  { icon: '🔐', title: 'Aman & Terverifikasi',  desc: 'Autentikasi JWT stateless dengan kontrol akses berbasis peran penyewa dan pemilik' },
  { icon: '📦', title: 'Inventaris Lengkap',     desc: 'Kelola barang elektronik dengan pemantauan stok otomatis real-time' },
  { icon: '⚡', title: 'Transaksi Real-time',    desc: 'Database transaction untuk menjaga integritas data saat peminjaman bersamaan' },
  { icon: '🌿', title: 'Ramah Lingkungan',       desc: 'Kurangi limbah elektronik dengan sistem sewa yang efisien dan berkelanjutan' },
]

onMounted(async () => {
  try {
    const res  = await fetch(`${API}/items`)
    const data = await res.json()
    totalBarang.value = (data.data || []).length
  } catch { totalBarang.value = 4 }
})
</script>

<style scoped>
.home { min-height: 100vh; position: relative; z-index: 1; }

.hero {
  text-align: center;
  padding: 5rem 2rem 3rem;
  max-width: 720px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  background: rgba(124,58,237,0.15);
  border: 1px solid var(--border);
  color: var(--accent);
  padding: 0.35rem 1.2rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.hero h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.12;
  margin-bottom: 1.2rem;
}

.hero h1 span {
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.75;
  margin-bottom: 2rem;
}

.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* STATS */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;
  flex-wrap: wrap;
}
.stat-item { text-align: center; }
.stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-lbl { color: var(--text-muted); font-size: 0.82rem; margin-top: 0.2rem; }

/* SECTION */
.section { padding: 2rem 2rem 4rem; max-width: 1100px; margin: 0 auto; }
.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: all 0.25s;
}
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
  border-color: var(--primary);
}
.feature-icon { font-size: 2rem; margin-bottom: 0.8rem; }
.feature-title { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 0.4rem; }
.feature-desc  { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
</style>