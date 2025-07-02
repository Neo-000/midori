<template>
  <div>
    <div v-if="user">
      <h2>Личный кабинет</h2>
      <p>Добро пожаловать, {{ user.name }}!</p>
      <!-- Здесь может быть профиль, заказы и т.д. -->
    </div>
    <LoginModal v-else v-model="loginModal" @success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginModal from '../components/LoginModal.vue'

// Моковый "стейт пользователя" (в реальности — импортируй из store/pinia)
const user = ref(null)
const loginModal = ref(true)

function handleLoginSuccess(userData) {
  user.value = userData
  loginModal.value = false
}
</script>
