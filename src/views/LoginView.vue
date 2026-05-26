<!-- ============================================
     VIEWS/LOGINVIEW.VUE - Halaman Login & Register
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">🌿 ECO-SHARE</div>
      <h2>{{ tab === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru' }}</h2>
      <p class="login-sub">Platform penyewaan elektronik bekas ramah lingkungan</p>

      <!-- TAB -->
      <div class="tab-wrap">
        <div :class="['tab', tab === 'login' ? 'active' : '']" @click="tab = 'login'">🔐 Masuk</div>
        <div :class="['tab', tab === 'register' ? 'active' : '']" @click="tab = 'register'">✨ Daftar</div>
      </div>

      <!-- FORM LOGIN -->
      <div v-if="tab === 'login'">
        <div class="form-group">
          <label>Alamat Email</label>
          <input type="email" v-model="loginForm.email" placeholder="email@contoh.com" @keyup.enter="handleLogin" />
        </div>
        <div class="form-group">
          <label>Kata Sandi</label>
          <input type="password" v-model="loginForm.password" placeholder="Minimal 6 karakter" @keyup.enter="handleLogin" />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center" @click="handleLogin" :disabled="loading">
          {{ loading ? '⏳ Memuat...' : '🚀 Masuk Sekarang' }}
        </button>
        <p class="hint">
          Akun test:<br>
          Pemilik: <code>pemilik@ecoshare.com</code><br>
          Penyewa: <code>penyewa@ecoshare.com</code><br>
          Sandi: <code>password123</code>
        </p>
      </div>

      <!-- FORM REGISTER -->
      <div v-if="tab === 'register'">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="regForm.nama" placeholder="Nama lengkap kamu" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="regForm.email" placeholder="email@contoh.com" />
        </div>
        <div class="form-group">
          <label>Kata Sandi</label>
          <input type="password" v-model="regForm.password" placeholder="Minimal 6 karakter" />
        </div>
        <div class="form-group">
          <label>Daftar Sebagai</label>
          <select v-model="regForm.role">
            <option value="penyewa">🛍️ Penyewa (mau sewa barang)</option>
            <option value="pemilik">🏷️ Pemilik (mau sewakan barang)</option>
          </select>
        </div>
        <div class="form-group">
          <label>No. Telepon</label>
          <input type="text" v-model="regForm.no_hp" placeholder="08xxxxxxxxxx" />
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <input type="text" v-model="regForm.alamat" placeholder="Kota / Kabupaten" />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center" @click="handleRegister" :disabled="loading">
          {{ loading ? '⏳ Memuat...' : '✨ Daftar Sekarang' }}
        </button>
      </div>

      <!-- ALERT -->
      <div v-if="message" :class="['alert', messageType]">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router  = useRouter()
const tab     = ref('login')
const loading = ref(false)
const message = ref('')
const messageType = ref('error')

const API = 'http://localhost:3000/api'

const loginForm = ref({ email: '', password: '' })
const regForm   = ref({ nama: '', email: '', password: '', role: 'penyewa', no_hp: '', alamat: '' })

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    message.value = '❌ Email dan kata sandi wajib diisi!'; messageType.value = 'error'; return
  }
  loading.value = true; message.value = ''
  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value)
    })
    const data = await res.json()
    if (!res.ok) { message.value = '❌ ' + data.message; messageType.value = 'error'; return }

    localStorage.setItem('eco_token', data.data.token)
    localStorage.setItem('eco_user',  JSON.stringify(data.data.user))
    message.value = '✅ Login berhasil! Mengalihkan...'; messageType.value = 'success'
    setTimeout(() => router.push('/dashboard'), 800)
  } catch {
    message.value = '❌ Gagal terhubung ke server! Pastikan backend (npm run dev) berjalan di port 3000.'
    messageType.value = 'error'
  } finally { loading.value = false }
}

const handleRegister = async () => {
  if (!regForm.value.nama || !regForm.value.email || !regForm.value.password) {
    message.value = '❌ Lengkapi semua field wajib!'; messageType.value = 'error'; return
  }
  loading.value = true; message.value = ''
  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm.value)
    })
    const data = await res.json()
    if (!res.ok) { message.value = '❌ ' + data.message; messageType.value = 'error'; return }
    message.value = '✅ Pendaftaran berhasil! Silakan masuk.'; messageType.value = 'success'
    tab.value = 'login'
  } catch {
    message.value = '❌ Gagal terhubung ke server!'; messageType.value = 'error'
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.login-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow);
}

.login-logo {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

h2 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.3rem; }
.login-sub { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 1.5rem; }

.tab-wrap {
  display: flex;
  background: var(--bg-card2);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 1.5rem;
  gap: 4px;
}
.tab {
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.2s;
}
.tab.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
}

.hint {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 1rem;
  line-height: 1.8;
}
.hint code { color: var(--accent); font-size: 0.75rem; }

.alert {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
}
.alert.error   { background: rgba(244,63,94,0.15);  color: var(--danger);  border: 1px solid rgba(244,63,94,0.3); }
.alert.success { background: rgba(34,211,160,0.15); color: var(--success); border: 1px solid rgba(34,211,160,0.3); }
</style>