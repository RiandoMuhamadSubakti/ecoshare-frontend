<!-- ============================================
     VIEWS/HOMEVIEW.VUE - Halaman Utama
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="home">
    <div class="hero">
      <div class="hero-badge">🌱 Platform Ramah Lingkungan</div>
      <h1>Sewa Elektronik Bekas,<br><span>Hemat & Berkelanjutan</span></h1>
      <p>Kurangi limbah elektronik dengan menyewa, bukan membeli. Temukan ribuan alat elektronik berkualitas dari sesama pengguna.</p>
      <div class="hero-actions">
        <RouterLink to="/items" class="btn btn-primary">🔍 Jelajahi Barang</RouterLink>
        <RouterLink to="/login" class="btn btn-ghost">🚀 Mulai Sekarang</RouterLink>
      </div>
    </div>

    <div class="features">
      <div class="feature-card" v-for="f in features" :key="f.icon">
        <div class="feature-icon">{{ f.icon }}</div>
        <div class="feature-title">{{ f.title }}</div>
        <div class="feature-desc">{{ f.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const features = [
  { icon: '🔐', title: 'Aman & Terverifikasi',  desc: 'Autentikasi JWT dengan kontrol akses berbasis peran pengguna' },
  { icon: '📦', title: 'Inventaris Lengkap',     desc: 'Kelola barang elektronik dengan pemantauan stok otomatis' },
  { icon: '⚡', title: 'Transaksi Real-time',    desc: 'Database transaction untuk menjaga integritas data peminjaman' },
  { icon: '🌿', title: 'Ramah Lingkungan',       desc: 'Kurangi limbah elektronik dengan sistem sewa yang efisien' },
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 2rem;
}
.hero {
  text-align: center;
  padding: 4rem 1rem 3rem;
  max-width: 700px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  background: rgba(219,39,119,0.15);
  border: 1px solid var(--border);
  color: var(--accent);
  padding: 0.35rem 1.2rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.hero h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
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
  line-height: 1.7;
  margin-bottom: 2rem;
}
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 3rem;
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
.feature-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
</style>