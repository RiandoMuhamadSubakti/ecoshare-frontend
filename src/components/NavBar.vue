<!-- ============================================
     COMPONENTS/NAVBAR.VUE
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <nav class="navbar">
    <div class="nav-logo">🌸 ECO-SHARE</div>
    <div class="nav-links">
      <RouterLink to="/dashboard" class="nav-link">📊 Dashboard</RouterLink>
      <RouterLink to="/items"     class="nav-link">📦 Barang</RouterLink>
      <RouterLink to="/riwayat"   class="nav-link" v-if="isPenyewa">📋 Riwayat</RouterLink>
    </div>
    <div class="nav-right">
      <span class="user-badge">{{ userName }}</span>
      <button class="btn btn-danger btn-sm" @click="logout">🚪 Keluar</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const user = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
const userName = computed(() => user.value?.nama || '-')
const isPenyewa = computed(() => user.value?.role === 'penyewa')

const logout = () => {
  localStorage.removeItem('eco_token')
  localStorage.removeItem('eco_user')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: sticky; top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 2rem;
  background: rgba(15, 8, 16, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.nav-logo {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-links { display: flex; gap: 0.5rem; }
.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.87rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.2s;
  border: 1px solid transparent;
}
.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(219,39,119,0.15);
  color: var(--accent);
  border-color: var(--border);
}
.nav-right { display: flex; align-items: center; gap: 0.75rem; }
.user-badge {
  font-size: 0.82rem;
  color: var(--accent);
  background: rgba(219,39,119,0.12);
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  border: 1px solid var(--border);
}
</style>