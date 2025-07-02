<template>
    <el-dialog
      v-model="show"
      width="350px"
      :close-on-click-modal="false"
      center
    >
      <template #header>
        <div class="dialog-title">{{ isRegister ? 'Регистрация' : 'Вход' }}</div>
      </template>
      <el-form :model="form" class="login-form">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="Email" autocomplete="username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="Пароль" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-button
          type="primary"
          style="width: 100%; margin-top: 6px"
          @click="submit"
        >
          {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
        </el-button>
        <div style="text-align:center; margin-top:14px; font-size:13px;">
          <a href="#" @click.prevent="isRegister = !isRegister">
            {{ isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
          </a>
        </div>
      </el-form>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue'
  const props = defineProps({
    modelValue: Boolean,
  })
  const emit = defineEmits(['update:modelValue', 'success'])
  const show = ref(props.modelValue)
  watch(() => props.modelValue, v => show.value = v)
  watch(show, v => emit('update:modelValue', v))
  
  const isRegister = ref(false)
  const form = reactive({ email: '', password: '' })
  
  function submit() {
    // Мок: если что-то ввели — считаем, что залогинились
    if (form.email && form.password) {
      emit('success', { email: form.email, name: form.email.split('@')[0] })
      show.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-form { margin-top: 18px; }
  .dialog-title { font-size: 19px; font-weight: 600; }
  </style>
  