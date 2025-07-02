<script setup>
import AppHeader from './components/AppHeader.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'

const auth = useAuthStore()
onMounted(() => {
  auth.fetchMe()
})
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <router-view />
  </div>
</template>

<style>
.app-container {
  max-width: 1240px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .app-container {
    padding-left: 12px;
    padding-right: 12px;
  }
}

@media (max-width: 600px) {
  .app-container {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
