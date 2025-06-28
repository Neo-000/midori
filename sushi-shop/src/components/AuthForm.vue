<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="onSubmit"
      style="margin-top:10px;"
    >
      <el-form-item label="Номер телефона" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="+7 (___) ___-__-__"
          maxlength="16"
          @input="formatPhone"
        />
      </el-form-item>
      <el-form-item v-if="mode === 'register'" label="Имя" prop="name">
        <el-input v-model="form.name" placeholder="Ваше имя" />
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input v-model="form.password" type="password" placeholder="Пароль" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit" style="width:100%;">
          {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </el-button>
      </el-form-item>
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        style="margin-bottom:12px;"
      />
      <div style="text-align:center; color:#999;">
        <span v-if="mode === 'login'">
          Нет аккаунта? <a @click="mode='register'" style="color:#7b39e9;cursor:pointer">Зарегистрироваться</a>
        </span>
        <span v-else>
          Уже есть аккаунт? <a @click="mode='login'" style="color:#7b39e9;cursor:pointer">Войти</a>
        </span>
      </div>
    </el-form>
    <div style="font-size:12px;text-align:center; margin-top:18px; color:#aaa;">
      Нажимая, вы принимаете<br>
      <a href="#" style="color:#7b39e9;">Пользовательское соглашение</a> и
      <a href="#" style="color:#7b39e9;">Политику конфиденциальности</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import auth from '../stores/auth'
import { useAttrs } from 'vue'

const mode = ref('login') // login | register
const loading = ref(false)
const error = ref('')
const formRef = ref(null)
const form = ref({
  phone: '',
  name: '',
  password: ''
})

// ВАЖНО! для emit в <script setup>
const emit = defineEmits(['success'])

// Простые правила валидации
const rules = {
  phone: [
    { required: true, message: 'Телефон обязателен', trigger: 'blur' },
    { min: 10, message: 'Некорректный номер', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Имя обязательно', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Пароль обязателен', trigger: 'blur' },
    { min: 3, message: 'Пароль слишком короткий', trigger: 'blur' }
  ]
}

// Форматирование телефона под российский
function formatPhone() {
  // Только цифры, + в начале
  let num = form.value.phone.replace(/\D/g, '')
  if (num.length > 10) num = num.slice(0, 11)
  form.value.phone = '+7' + (num.startsWith('7') ? num.slice(1) : num)
}

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      // Логируем отправляемые данные
      console.log('Попытка входа:', {
        phone: form.value.phone,
        password: form.value.password
      })

      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        phone: form.value.phone,
        password: form.value.password
      })

      // Логируем ответ сервера
      console.log('Ответ сервера на login:', data)
      console.log('Данные для сохранения:', data.user)
      auth.login(data.token, data.user)
      loading.value = false
      error.value = ''
      form.value.password = ''
      // emit success для закрытия модалки
      emit('success')
    } else {
      // Логируем отправляемые данные при регистрации
      console.log('Попытка регистрации:', {
        name: form.value.name,
        phone: form.value.phone,
        password: form.value.password
      })

      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.value.name,
        phone: form.value.phone,
        password: form.value.password
      })

      // Логируем ответ сервера на регистрацию
      console.log('Ответ сервера на register:', data)

      mode.value = 'login'
      error.value = 'Регистрация прошла успешно! Войдите.'
      loading.value = false
    }
  } catch (e) {
    loading.value = false
    error.value = e.response?.data?.message || 'Ошибка'
    // Логируем ошибку для отладки
    console.log('Ошибка при авторизации/регистрации:', e.response?.data || e)
  }
}
</script>
