<template>
  <div style="max-width: 400px; margin: 40px auto;">
    <el-card>
      <h2>Регистрация</h2>
      <el-form @submit.prevent="register" :model="form">
        <el-form-item label="Имя">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" :loading="loading">Зарегистрироваться</el-button>
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

const form = ref({ name: '', phone: '', password: '' })
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function register() {
  error.value = ''
  loading.value = true
  try {
    await axios.post('http://localhost:5000/api/auth/register', form.value)
    loading.value = false
    // Можно сразу логинить пользователя, но пока просто перенаправим на вход
    router.push('/login')
  } catch (e) {
    loading.value = false
    error.value = e.response?.data?.message || 'Ошибка регистрации'
  }
}
</script>
