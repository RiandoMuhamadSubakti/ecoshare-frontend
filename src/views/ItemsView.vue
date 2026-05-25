<!-- ============================================
     VIEWS/ITEMSVIEW.VUE - Halaman Daftar Barang
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="items-page">
    <h1 class="page-title">📦 Inventaris Barang</h1>
    <p class="page-sub">Semua barang elektronik yang tersedia untuk disewa.</p>

    <div class="toolbar">
      <input v-model="search" type="text" placeholder="🔍 Cari barang..." class="search-input" />
      <select v-model="filterStatus" class="filter-select">
        <option value="">Semua Status</option>
        <option value="tersedia">Tersedia</option>
        <option value="disewa">Sedang Disewa</option>
      </select>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="filtered.length === 0" class="empty">
      <div class="empty-icon">📦</div>
      <p>Tidak ada barang ditemukan</p>
    </div>
    <div v-else class="items-grid">
      <div class="item-card" v-for="item in filtered" :key="item.id" @click="openSewa(item)">
        <div class="item-img">{{ icons[item.id % icons.length] }}</div>
        <div class="item-body">
          <div class="item-name">{{ item.nama_barang }}</div>
          <div class="item-desc">{{ item.deskripsi || 'Tidak ada deskripsi' }}</div>
          <div class="item-footer">
            <div class="item-price">{{ formatRp(item.harga_per_hari) }}<small>/hari</small></div>
            <span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">
              {{ item.status }}
            </span>
          </div>
          <p class="item-meta">Stok: {{ item.stok }} • {{ item.nama_pemilik }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API = 'http://localhost:3000/api'
const items = ref([])
const loading = ref(false)
const search = ref('')
const filterStatus = ref('')
const icons = ['💻','📷','🎮','📡','🖨️','🎬','🔋','📱','🎧','⌚']

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const filtered = computed(() => items.value.filter(item => {
  const matchSearch = !search.value || item.nama_barang.toLowerCase().includes(search.value.toLowerCase())
  const matchStatus = !filterStatus.value || item.status === filterStatus.value
  return matchSearch && matchStatus
}))

const loadItems = async () => {
  loading.value = true
  try {
    const res  = await fetch(`${API}/items`)
    const data = await res.json()
    items.value = data.data || []
  } catch { console.error('Gagal memuat barang') }
  finally { loading.value = false }
}

const openSewa = (item) => {
  if (!localStorage.getItem('eco_token')) {
    alert('Silakan login terlebih dahulu untuk menyewa barang!')
    return
  }
  alert(`Barang: ${item.nama_barang}\nHarga: ${formatRp(item.harga_per_hari)}/hari\nStatus: ${item.status}`)
}

onMounted(loadItems)
</script>

<style scoped>
.items-page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
.page-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem; }
.page-sub { color: var(--text-muted); margin-bottom: 1.5rem; }
.toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-input { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: 0.6rem 1.2rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: 0.88rem; outline: none; width: 240px; }
.search-input:focus { border-color: var(--primary); }
.filter-select { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: 0.6rem 1rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: 0.85rem; outline: none; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 1.2rem; }
.item-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.25s; }
.item-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); border-color: var(--primary); }
.item-img { height: 120px; background: linear-gradient(135deg, var(--bg-card2), rgba(219,39,119,0.1)); display: flex; align-items: center; justify-content: center; font-size: 2.8rem; }
.item-body { padding: 1rem; }
.item-name { font-family: 'Syne',sans-serif; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.3rem; }
.item-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.7rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-footer { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
.item-price { font-family: 'Syne',sans-serif; font-weight: 700; color: var(--accent); }
.item-price small { font-size: 0.68rem; color: var(--text-muted); font-family: 'DM Sans',sans-serif; font-weight: 400; }
.item-meta { font-size: 0.74rem; color: var(--text-muted); }
.empty { text-align: center; padding: 3rem; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
</style>