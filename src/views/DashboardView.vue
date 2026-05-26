<!-- ============================================
     VIEWS/DASHBOARDVIEW.VUE - Halaman Dashboard
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="dashboard">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="page-sub">Selamat datang kembali, <strong style="color:var(--accent)">{{ userName }}</strong>! 👋</p>
      </div>
      <span :class="['badge', user?.role === 'pemilik' ? 'badge-purple' : 'badge-success']">
        {{ user?.role === 'pemilik' ? '🏷️ Pemilik Barang' : '🛍️ Penyewa' }}
      </span>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-grid">
      <div class="stat-card" style="--clr:#a855f7">
        <div class="stat-icon">📦</div>
        <div class="stat-label">Total Barang</div>
        <div class="stat-value" style="color:#a855f7">{{ stats.total }}</div>
        <div class="stat-change">↑ Di platform</div>
      </div>
      <div class="stat-card" style="--clr:#22d3a0">
        <div class="stat-icon">✅</div>
        <div class="stat-label">Tersedia</div>
        <div class="stat-value" style="color:#22d3a0">{{ stats.tersedia }}</div>
        <div class="stat-change">↑ Siap disewa</div>
      </div>
      <div class="stat-card" style="--clr:#fbbf24">
        <div class="stat-icon">🔄</div>
        <div class="stat-label">Sedang Disewa</div>
        <div class="stat-value" style="color:#fbbf24">{{ stats.disewa }}</div>
        <div class="stat-change">↑ Aktif berjalan</div>
      </div>
      <div class="stat-card" style="--clr:#c084fc">
        <div class="stat-icon">👤</div>
        <div class="stat-label">Role Kamu</div>
        <div class="stat-value" style="color:#c084fc;font-size:1.2rem">{{ user?.role }}</div>
        <div class="stat-change">Akses sesuai peran</div>
      </div>
    </div>

    <!-- TABEL BARANG TERBARU -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">🕐 Barang Terbaru di Platform</div>
        <button class="btn btn-ghost btn-sm" @click="loadData">🔄 Refresh</button>
      </div>
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="items.length === 0" class="empty">
        <div class="empty-icon">📦</div>
        <p>Belum ada barang tersedia</p>
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Barang</th>
              <th>Pemilik</th>
              <th>Harga/Hari</th>
              <th>Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items.slice(0, 6)" :key="item.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ item.nama_barang }}</td>
              <td>{{ item.nama_pemilik }}</td>
              <td class="purple">{{ formatRp(item.harga_per_hari) }}</td>
              <td>{{ item.stok }} unit</td>
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

    <!-- INFO PROFIL -->
    <div class="card" style="margin-top:1.2rem">
      <div class="card-header">
        <div class="card-title">👤 Informasi Profil</div>
      </div>
      <div class="profil-grid">
        <div class="profil-item">
          <span class="profil-label">📧 Email</span>
          <span>{{ user?.email || '-' }}</span>
        </div>
        <div class="profil-item">
          <span class="profil-label">👤 Nama</span>
          <span>{{ user?.nama || '-' }}</span>
        </div>
        <div class="profil-item">
          <span class="profil-label">🏷️ Role</span>
          <span class="badge badge-purple">{{ user?.role }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API  = 'http://localhost:3000/api'
const user = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
const userName = computed(() => user.value?.nama || '-')

const items   = ref([])
const loading = ref(false)

const stats = computed(() => ({
  total:    items.value.length,
  tersedia: items.value.filter(i => i.status === 'tersedia').length,
  disewa:   items.value.filter(i => i.status === 'disewa').length,
}))

const formatRp = n => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n)

const loadData = async () => {
  loading.value = true
  try {
    const res  = await fetch(`${API}/items`)
    const data = await res.json()
    items.value = data.data || []
  } catch { console.error('Gagal memuat data') }
  finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.dashboard { padding: 2rem; max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; }
.page-sub   { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.4rem;
  transition: all 0.22s;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: -20px; right: -20px;
  width: 70px; height: 70px;
  border-radius: 50%;
  background: var(--clr, var(--primary));
  opacity: 0.1;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }

.stat-icon   { font-size: 1.4rem; margin-bottom: 0.8rem; }
.stat-label  { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 0.3rem; }
.stat-value  { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; }
.stat-change { font-size: 0.72rem; color: var(--success); margin-top: 0.3rem; }

.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.card-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-title  { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }

.table-wrap { overflow-x: auto; }
table  { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
thead  { background: rgba(124,58,237,0.1); }
th     { text-align: left; padding: 0.9rem 1.2rem; font-family: 'Syne', sans-serif; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent); white-space: nowrap; }
td     { padding: 0.9rem 1.2rem; border-top: 1px solid var(--border); color: var(--text-muted); }
td.bold   { color: var(--text); font-weight: 600; }
td.purple { color: var(--accent); font-weight: 600; }
tr:hover td { background: rgba(124,58,237,0.05); }

.profil-grid { padding: 1rem 1.5rem; display: grid; gap: 0.6rem; }
.profil-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.8rem; background: var(--bg-card2); border-radius: 8px; font-size: 0.87rem; }
.profil-label { color: var(--text-muted); }
</style>