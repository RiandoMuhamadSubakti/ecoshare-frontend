<!-- ============================================
     VIEWS/RIWAYATVIEW.VUE - Riwayat Sewa
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="riwayat-page">
    <h1 class="page-title">📋 Riwayat Peminjaman</h1>
    <p class="page-sub">Semua riwayat sewa barang yang pernah kamu lakukan.</p>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="riwayat.length === 0" class="empty">
      <div style="font-size:2.5rem;margin-bottom:.5rem">📋</div>
      <p>Belum ada riwayat peminjaman</p>
    </div>
    <div v-else class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Barang</th>
              <th>Mulai</th>
              <th>Selesai</th>
              <th>Hari</th>
              <th>Total Biaya</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in riwayat" :key="r.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ r.nama_barang }}</td>
              <td>{{ formatTgl(r.tanggal_mulai) }}</td>
              <td>{{ formatTgl(r.tanggal_selesai) }}</td>
              <td>{{ r.jumlah_hari }} hari</td>
              <td class="pink">{{ formatRp(r.total_biaya) }}</td>
              <td>
                <span :class="['badge', statusClass(r.status)]">{{ r.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API     = 'http://localhost:3000/api'
const riwayat = ref([])
const loading = ref(false)

const formatRp  = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)
const formatTgl = s => s ? new Date(s).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-'
const statusClass = s => ({ aktif:'badge-success', selesai:'badge-pink', dibatalkan:'badge-danger', pending:'badge-warning' }[s] || '')

const loadRiwayat = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch(`${API}/rentals/riwayat`, { headers: { Authorization: `Bearer ${token}` } })
    const data  = await res.json()
    riwayat.value = data.data || []
  } catch { console.error('Gagal memuat riwayat') }
  finally { loading.value = false }
}

onMounted(loadRiwayat)
</script>

<style scoped>
.riwayat-page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
.page-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem; }
.page-sub { color: var(--text-muted); margin-bottom: 1.5rem; }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
thead { background: rgba(219,39,119,0.1); }
th { text-align: left; padding: 0.9rem 1.2rem; font-family: 'Syne',sans-serif; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent); white-space: nowrap; }
td { padding: 0.9rem 1.2rem; border-top: 1px solid var(--border); color: var(--text-muted); white-space: nowrap; }
td.bold { color: var(--text); font-weight: 600; }
td.pink { color: var(--accent); font-weight: 600; }
tr:hover td { background: rgba(219,39,119,0.05); }
.empty { text-align: center; padding: 3rem; color: var(--text-muted); }
</style>