<!-- ============================================
     VIEWS/DASHBOARDVIEW.VUE - Halaman Dashboard
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="page-sub">Selamat datang kembali, <strong>{{ userName }}</strong>! 👋</p>
      </div>
      <span :class="['badge', user?.role === 'pemilik' ? 'badge-pink' : 'badge-success']">
        {{ user?.role === 'pemilik' ? '🏷️ Pemilik' : '🛍️ Penyewa' }}
      </span>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid">
      <div class="stat-card purple">
        <div class="stat-icon">📦</div>
        <div class="stat-label">Total Barang</div>
        <div class="stat-value">{{ stats.totalBarang }}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">✅</div>
        <div class="stat-label">Barang Tersedia</div>
        <div class="stat-value">{{ stats.tersedia }}</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">🔄</div>
        <div class="stat-label">Sedang Disewa</div>
        <div class="stat-value">{{ stats.disewa }}</div>
      </div>
      <div class="stat-card pink">
        <div class="stat-icon">👤</div>
        <div class="stat-label">Role Kamu</div>
        <div class="stat-value" style="font-size:1.2rem">{{ user?.role }}</div>
      </div>
    </div>

    <!-- Tabel Barang Terbaru -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">🕐 Barang Terbaru</div>
        <button class="btn btn-ghost btn-sm" @click="loadData">🔄 Refresh</button>
      </div>
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="items.length === 0" class="empty">
        <p>Belum ada data barang</p>
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Barang</th>
              <th>Pemilik</th>
              <th>Harga/Hari</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items.slice(0, 6)" :key="item.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ item.nama_barang }}</td>
              <td>{{ item.nama_pemilik }}</td>
              <td class="pink">{{ formatRp(item.harga_per_hari) }}</td>
              <td>
                <span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API     = 'http://localhost:3000/api'
const user    = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
const userName = computed(() => user.value?.nama || '-')
const items   = ref([])
const loading = ref(false)

const stats = computed(() => ({
  totalBarang: items.value.length,
  tersedia:    items.value.filter(i => i.status === 'tersedia').length,
  disewa:      items.value.filter(i => i.status === 'disewa').length,
}))

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const loadData = async () => {
  loading.value = true
  try {
    const res  = await fetch(`${API}/items`)
    const data = await res.json()
    items.value = data.data || []
  } catch {
    console.error('Gagal memuat data')
  } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.dashboard { padding: 2rem; max-width: 1100px; margin: 0 auto; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.page-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; }
.page-sub { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 1.2rem; margin-bottom: 2rem; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.4rem; transition: all 0.2s; }
.stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.stat-icon { font-size: 1.5rem; margin-bottom: 0.8rem; }
.stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 0.3rem; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; }
.stat-card.purple .stat-value { color: #a855f7; }
.stat-card.green  .stat-value { color: var(--success); }
.stat-card.orange .stat-value { color: var(--warning); }
.stat-card.pink   .stat-value { color: var(--accent); }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.card-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-title { font-family: 'Syne', sans-serif; font-weight: 700; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
thead { background: rgba(219,39,119,0.1); }
th { text-align: left; padding: 0.9rem 1.2rem; font-family: 'Syne', sans-serif; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent); white-space: nowrap; }
td { padding: 0.9rem 1.2rem; border-top: 1px solid var(--border); color: var(--text-muted); }
td.bold { color: var(--text); font-weight: 600; }
td.pink { color: var(--accent); font-weight: 600; }
tr:hover td { background: rgba(219,39,119,0.05); }
.empty { text-align: center; padding: 2rem; color: var(--text-muted); }
</style>