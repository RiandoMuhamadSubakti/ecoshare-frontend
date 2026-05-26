<!-- ============================================
     COMPONENTS/NAVBAR.VUE - Navigasi Utama
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <nav class="navbar">
    <div class="nav-logo">🌿 ECO-SHARE</div>

    <div class="nav-links">
      <RouterLink to="/dashboard" class="nav-link">📊 Dashboard</RouterLink>
      <RouterLink to="/items"     class="nav-link">📦 Barang</RouterLink>
      <RouterLink to="/riwayat"   class="nav-link" v-if="isPenyewa">📋 Riwayat</RouterLink>
    </div>

    <div class="nav-right">
      <div class="user-info">
        <span class="user-avatar">{{ userInitial }}</span>
        <div>
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ user?.role }}</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" @click="logout">🚪 Keluar</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const user   = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
const userName    = computed(() => user.value?.nama || '-')
const userInitial = computed(() => user.value?.nama?.charAt(0).toUpperCase() || '?')
const isPenyewa   = computed(() => user.value?.role === 'penyewa')

const logout = () => {
  localStorage.removeItem('eco_token')
  localStorage.removeItem('eco_user')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 2rem;
  background: rgba(8, 8, 26, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.nav-logo {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links { display: flex; gap: 0.4rem; }

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
  background: rgba(124,58,237,0.15);
  color: var(--accent);
  border-color: var(--border);
}

.nav-right { display: flex; align-items: center; gap: 0.75rem; }

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(124,58,237,0.12);
  border: 1px solid var(--border);
  border-radius: 50px;
  padding: 0.3rem 0.8rem 0.3rem 0.3rem;
}

.user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.user-name { font-size: 0.82rem; font-weight: 600; line-height: 1.2; }
.user-role { font-size: 0.68rem; color: var(--text-muted); }
</style>