<template>
  <div style="max-width: 400px; margin: 40px auto;">
    <el-card>
      <h2>Вход</h2>
      <el-form @submit.prevent="login" :model="form">
        <el-form-item label="Телефон">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" :loading="loading">Войти</el-button>
        </el-form-item>
        <div v-if="error" style="color:red">{{ error }}</div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const form = ref({ phone: '', password: '' })
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  loading.value = true
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', form.value)
    // Сохраняем токен и данные пользователя в localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    loading.value = false
    router.push('/') // после входа на главную или в личный кабинет
  } catch (e) {
    loading.value = false
    error.value = e.response?.data?.message || 'Ошибка входа'
  }
}
</script>
