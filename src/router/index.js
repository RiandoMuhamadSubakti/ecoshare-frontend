// ============================================
// ROUTER/INDEX.JS - Pengaturan Halaman
// Dibuat oleh: Riando Muhamad Subakti
// Universitas Dian Nusantara
// ============================================

import { createRouter, createWebHistory } from 'vue-router'
import HomeView      from '../views/HomeView.vue'
import LoginView     from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ItemsView     from '../views/ItemsView.vue'
import RiwayatView   from '../views/RiwayatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          name: 'home',      component: HomeView },
    { path: '/login',     name: 'login',     component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/items',     name: 'items',     component: ItemsView },
    { path: '/riwayat',   name: 'riwayat',   component: RiwayatView, meta: { requiresAuth: true } },
  ]
})

// Guard: kalau belum login, redirect ke halaman login
router.beforeEach((to) => {
  const token = localStorage.getItem('eco_token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }
})

export default router