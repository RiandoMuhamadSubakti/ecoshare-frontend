<!-- ============================================
     VIEWS/RIWAYATVIEW.VUE - Riwayat Peminjaman
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="riwayat-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">📋 Riwayat Peminjaman</h1>
        <p class="page-sub">Semua riwayat sewa barang yang pernah kamu lakukan.</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="loadRiwayat">🔄 Refresh</button>
    </div>

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="riwayat.length === 0" class="empty">
      <div class="empty-icon">📋</div>
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in riwayat" :key="r.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ r.nama_barang }}</td>
              <td>{{ formatTgl(r.tanggal_mulai) }}</td>
              <td>{{ formatTgl(r.tanggal_selesai) }}</td>
              <td>{{ r.jumlah_hari }} hari</td>
              <td class="purple">{{ formatRp(r.total_biaya) }}</td>
              <td>
                <span :class="['badge', statusClass(r.status)]">{{ r.status }}</span>
              </td>
              <td>
                <div v-if="r.status === 'aktif'" style="display:flex;flex-direction:column;gap:4px">
                  <button class="btn btn-success btn-sm" @click="aksiRental(r.id, 'selesai')">✅ Kembalikan</button>
                  <button class="btn btn-danger btn-sm"  @click="aksiRental(r.id, 'batalkan')">❌ Batalkan</button>
                </div>
                <span v-else style="color:var(--text-muted);font-size:.78rem">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ALERT -->
    <div v-if="msg" :class="['alert-global', msgType]">{{ msg }}</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API     = 'http://localhost:3000/api'
const riwayat = ref([])
const loading = ref(false)
const msg     = ref('')
const msgType = ref('success')

const formatRp  = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)
const formatTgl = s => s ? new Date(s).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-'
const statusClass = s => ({
  aktif:      'badge-success',
  selesai:    'badge-info',
  dibatalkan: 'badge-danger',
  pending:    'badge-warning'
}[s] || 'badge-purple')

const loadRiwayat = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch(`${API}/rentals/riwayat`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data  = await res.json()
    riwayat.value = data.data || []
  } catch { console.error('Gagal memuat riwayat') }
  finally { loading.value = false }
}

const aksiRental = async (id, aksi) => {
  if (!confirm(`Yakin ingin ${aksi === 'selesai' ? 'mengembalikan' : 'membatalkan'} peminjaman ini?`)) return
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch(`${API}/rentals/${id}/${aksi}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data  = await res.json()
    if (!res.ok) { msg.value = '❌ ' + data.message; msgType.value = 'error'; return }
    msg.value = '✅ ' + data.message; msgType.value = 'success'
    setTimeout(() => msg.value = '', 3000)
    loadRiwayat()
  } catch {
    msg.value = '❌ Gagal melakukan aksi!'; msgType.value = 'error'
  }
}

onMounted(loadRiwayat)
</script>

<style scoped>
.riwayat-page { padding: 2rem; max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.page-title  { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; }
.page-sub    { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem; }

.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.table-wrap { overflow-x: auto; }
table  { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
thead  { background: rgba(124,58,237,0.1); }
th     { text-align: left; padding: 0.9rem 1.2rem; font-family: 'Syne', sans-serif; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--accent); white-space: nowrap; }
td     { padding: 0.9rem 1.2rem; border-top: 1px solid var(--border); color: var(--text-muted); white-space: nowrap; }
td.bold   { color: var(--text); font-weight: 600; }
td.purple { color: var(--accent); font-weight: 600; }
tr:hover td { background: rgba(124,58,237,0.05); }

.alert-global {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: .75rem 1.2rem;
  border-radius: 12px;
  font-size: .87rem;
  font-weight: 500;
  z-index: 999;
  animation: toastIn .3s ease;
}
@keyframes toastIn { from { opacity:0;transform:translateX(40px); } to { opacity:1;transform:translateX(0); } }
.alert-global.success { background: rgba(34,211,160,.18); border: 1px solid rgba(34,211,160,.35); color: var(--success); }
.alert-global.error   { background: rgba(244,63,94,.18);  border: 1px solid rgba(244,63,94,.35);  color: var(--danger); }
</style>