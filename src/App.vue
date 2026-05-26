<!-- ============================================
     APP.VUE - Komponen Root
     Dibuat oleh: Riando Muhamad Subakti
     Universitas Dian Nusantara
============================================ -->

<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <RouterView />
    <div class="watermark">
      Dibuat oleh: Riando Muhamad Subakti | Universitas Dian Nusantara
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const isLoggedIn = computed(() => !!localStorage.getItem('eco_token'))
</script>