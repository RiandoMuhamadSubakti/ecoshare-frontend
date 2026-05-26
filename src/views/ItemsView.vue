<!-- ============================================
     VIEWS/ITEMSVIEW.VUE - Halaman Inventaris Barang
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="items-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">📦 Inventaris Barang</h1>
        <p class="page-sub">Semua barang elektronik yang tersedia untuk disewa.</p>
      </div>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <input v-model="search" type="text" placeholder="🔍 Cari barang..." class="search-input" />
      <select v-model="filterStatus" class="filter-select">
        <option value="">Semua Status</option>
        <option value="tersedia">Tersedia</option>
        <option value="disewa">Sedang Disewa</option>
      </select>
      <span class="total-badge">{{ filtered.length }} barang</span>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="spinner"></div>

    <!-- EMPTY -->
    <div v-else-if="filtered.length === 0" class="empty">
      <div class="empty-icon">📦</div>
      <p>Tidak ada barang ditemukan</p>
    </div>

    <!-- GRID BARANG -->
    <div v-else class="items-grid">
      <div class="item-card" v-for="item in filtered" :key="item.id" @click="openDetail(item)">
        <div class="item-img">{{ icons[item.id % icons.length] }}</div>
        <div class="item-body">
          <div class="item-name">{{ item.nama_barang }}</div>
          <div class="item-desc">{{ item.deskripsi || 'Tidak ada deskripsi' }}</div>
          <div class="item-footer">
            <div class="item-price">
              {{ formatRp(item.harga_per_hari) }}<small>/hari</small>
            </div>
            <span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">
              {{ item.status }}
            </span>
          </div>
          <p class="item-meta">Stok: {{ item.stok }} unit &nbsp;•&nbsp; {{ item.nama_pemilik }}</p>
        </div>
      </div>
    </div>

    <!-- MODAL DETAIL SEWA -->
    <div class="modal-overlay" v-if="selectedItem" @click.self="selectedItem = null">
      <div class="modal">
        <div class="modal-title">{{ selectedItem.nama_barang }}</div>
        <p style="color:var(--text-muted);font-size:.87rem;line-height:1.6;margin-bottom:.8rem">
          {{ selectedItem.deskripsi || 'Tidak ada deskripsi' }}
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.8rem">
          <span :class="['badge', selectedItem.status === 'tersedia' ? 'badge-success' : 'badge-warning']">
            {{ selectedItem.status }}
          </span>
          <span class="badge badge-purple">Kondisi: {{ selectedItem.kondisi }}</span>
          <span class="badge badge-info">Stok: {{ selectedItem.stok }}</span>
        </div>
        <p style="font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:var(--accent);margin-bottom:.3rem">
          {{ formatRp(selectedItem.harga_per_hari) }}<span style="font-size:.78rem;color:var(--text-muted);font-weight:400">/hari</span>
        </p>
        <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:1rem">
          Pemilik: {{ selectedItem.nama_pemilik }}
        </p>

        <!-- Form Sewa (hanya untuk penyewa yang login) -->
        <div v-if="isPenyewa && selectedItem.status === 'tersedia'" class="sewa-form">
          <hr style="border-color:var(--border);margin-bottom:1rem">
          <p style="font-size:.82rem;font-weight:600;color:var(--accent);margin-bottom:1rem">📅 Jadwal Peminjaman</p>
          <div class="form-group">
            <label>Tanggal Mulai</label>
            <input type="date" v-model="sewaForm.tanggal_mulai" :min="today" @change="hitungEstimasi" />
          </div>
          <div class="form-group">
            <label>Tanggal Selesai</label>
            <input type="date" v-model="sewaForm.tanggal_selesai" :min="today" @change="hitungEstimasi" />
          </div>
          <div class="form-group">
            <label>Catatan (Opsional)</label>
            <textarea v-model="sewaForm.catatan" rows="2" placeholder="Catatan untuk pemilik..." style="resize:none"></textarea>
          </div>
          <div class="estimasi-box" v-if="estimasi > 0">
            <p style="font-size:.75rem;color:var(--text-muted)">Estimasi Biaya</p>
            <p style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--accent)">
              {{ formatRp(estimasi) }} ({{ hariSewa }} hari)
            </p>
          </div>
        </div>

        <div style="display:flex;gap:.75rem;margin-top:1rem">
          <button v-if="isPenyewa && selectedItem.status === 'tersedia'" class="btn btn-primary" style="flex:1" @click="handleSewa" :disabled="loadingSewa">
            {{ loadingSewa ? '⏳ Memproses...' : '🛒 Konfirmasi Sewa' }}
          </button>
          <button v-else-if="!isLoggedIn" class="btn btn-primary" style="flex:1" @click="$router.push('/login')">
            🔐 Masuk untuk Menyewa
          </button>
          <button v-else-if="selectedItem.status !== 'tersedia'" class="btn btn-ghost" style="flex:1" disabled>
            ❌ Barang Tidak Tersedia
          </button>
          <button class="btn btn-ghost" style="flex:1" @click="selectedItem = null">Tutup</button>
        </div>

        <div v-if="sewaMsg" :class="['alert', sewaMsgType]" style="margin-top:.8rem">{{ sewaMsg }}</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API    = 'http://localhost:3000/api'
const items  = ref([])
const loading = ref(false)
const search  = ref('')
const filterStatus = ref('')
const selectedItem = ref(null)
const loadingSewa  = ref(false)
const sewaMsg      = ref('')
const sewaMsgType  = ref('error')
const estimasi     = ref(0)
const hariSewa     = ref(0)

const icons = ['💻','📷','🎮','📡','🖨️','🎬','🔋','📱','🎧','⌚']

const user      = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
const isLoggedIn = computed(() => !!localStorage.getItem('eco_token'))
const isPenyewa  = computed(() => user.value?.role === 'penyewa')
const today      = computed(() => new Date().toISOString().split('T')[0])

const sewaForm = ref({ tanggal_mulai: '', tanggal_selesai: '', catatan: '' })

const formatRp = n => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n)

const filtered = computed(() => items.value.filter(item => {
  const matchSearch = !search.value || item.nama_barang.toLowerCase().includes(search.value.toLowerCase())
  const matchStatus = !filterStatus.value || item.status === filterStatus.value
  return matchSearch && matchStatus
}))

const hitungEstimasi = () => {
  if (!sewaForm.value.tanggal_mulai || !sewaForm.value.tanggal_selesai || !selectedItem.value) return
  const mulai   = new Date(sewaForm.value.tanggal_mulai)
  const selesai = new Date(sewaForm.value.tanggal_selesai)
  if (selesai > mulai) {
    hariSewa.value = Math.ceil((selesai - mulai) / (1000 * 60 * 60 * 24))
    estimasi.value = hariSewa.value * selectedItem.value.harga_per_hari
  } else {
    estimasi.value = 0; hariSewa.value = 0
  }
}

const openDetail = (item) => {
  selectedItem.value = item
  sewaForm.value = { tanggal_mulai: today.value, tanggal_selesai: '', catatan: '' }
  estimasi.value = 0; hariSewa.value = 0; sewaMsg.value = ''
}

const handleSewa = async () => {
  if (!sewaForm.value.tanggal_mulai || !sewaForm.value.tanggal_selesai) {
    sewaMsg.value = '❌ Isi tanggal mulai dan selesai!'; sewaMsgType.value = 'error'; return
  }
  loadingSewa.value = true; sewaMsg.value = ''
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch(`${API}/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item_id: selectedItem.value.id, ...sewaForm.value })
    })
    const data = await res.json()
    if (!res.ok) { sewaMsg.value = '❌ ' + data.message; sewaMsgType.value = 'error'; return }
    sewaMsg.value = `✅ Sewa berhasil! Total: ${formatRp(data.data.totalBiaya)}`
    sewaMsgType.value = 'success'
    loadItems()
    setTimeout(() => { selectedItem.value = null }, 2000)
  } catch {
    sewaMsg.value = '❌ Gagal terhubung ke server!'; sewaMsgType.value = 'error'
  } finally { loadingSewa.value = false }
}

const loadItems = async () => {
  loading.value = true
  try {
    const res  = await fetch(`${API}/items`)
    const data = await res.json()
    items.value = data.data || []
  } catch { console.error('Gagal memuat barang') }
  finally { loading.value = false }
}

onMounted(loadItems)
</script>

<style scoped>
.items-page { padding: 2rem; max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-title  { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; }
.page-sub    { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem; }

.toolbar { display: flex; gap: .75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
.search-input  { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: .6rem 1.2rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: .88rem; outline: none; width: 240px; transition: border-color .2s; }
.search-input:focus { border-color: var(--primary); }
.filter-select { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: .6rem 1rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: .85rem; outline: none; }
.total-badge   { font-size: .78rem; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); padding: .35rem .9rem; border-radius: 50px; }

.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 1.2rem; }
.item-card  { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all .25s; }
.item-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); border-color: var(--primary); }
.item-img   { height: 120px; background: linear-gradient(135deg, var(--bg-card2), rgba(124,58,237,.12)); display: flex; align-items: center; justify-content: center; font-size: 2.8rem; }
.item-body  { padding: 1rem; }
.item-name  { font-family: 'Syne',sans-serif; font-weight: 700; font-size: .95rem; margin-bottom: .3rem; }
.item-desc  { font-size: .78rem; color: var(--text-muted); line-height: 1.5; margin-bottom: .7rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-footer { display: flex; align-items: center; justify-content: space-between; margin-bottom: .4rem; flex-wrap: wrap; gap: .3rem; }
.item-price  { font-family: 'Syne',sans-serif; font-weight: 700; color: var(--accent); }
.item-price small { font-size: .68rem; color: var(--text-muted); font-family: 'DM Sans',sans-serif; font-weight: 400; }
.item-meta  { font-size: .74rem; color: var(--text-muted); }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); backdrop-filter: blur(10px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; animation: modalIn .28s ease; }
@keyframes modalIn { from { opacity:0;transform:scale(.92) translateY(16px); } to { opacity:1;transform:scale(1) translateY(0); } }
.modal-title { font-family: 'Syne',sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem; }

.estimasi-box { background: rgba(124,58,237,.1); border: 1px solid var(--border); border-radius: 10px; padding: .9rem; margin-bottom: 1rem; }
.alert { padding: .75rem 1rem; border-radius: 10px; font-size: .85rem; }
.alert.error   { background: rgba(244,63,94,.15);  color: var(--danger);  border: 1px solid rgba(244,63,94,.3); }
.alert.success { background: rgba(34,211,160,.15); color: var(--success); border: 1px solid rgba(34,211,160,.3); }
</style>