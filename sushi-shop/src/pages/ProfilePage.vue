<template>
  <Container>
    <div v-if="auth.user">
      <h2>Личный кабинет</h2>
      <p><b>Имя:</b> {{ auth.user.name }}</p>
      <p><b>Email:</b> {{ auth.user.email }}</p>
      <el-button type="danger" @click="auth.logout">Выйти</el-button>
    </div>
    <div v-else class="log">
      <LoginModal v-model="loginModal" @success="onLogin" />
      <el-button type="primary" @click="loginModal = true">
        Войти / Зарегистрироваться
      </el-button>
    </div>
  </Container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import LoginModal from '../components/LoginModal.vue'
import Container from '../components/Container.vue'

const auth = useAuthStore()
const loginModal = ref(false)

function onLogin() {
  loginModal.value = false
}
</script>

<style scoped>
.log{
  margin-top: 40px;
}

</style>