import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // Логин
  async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('Неверный email или пароль')
    const data = await res.json()
    user.value = data.user
    token.value = data.token
    localStorage.setItem('token', data.token)
  }

  // Регистрация
  async function register(email, password, name) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    if (!res.ok) throw new Error('Ошибка регистрации')
    // Можно автоматически залогинить после регистрации
    await login(email, password)
  }

  // Выход
  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  // Получить пользователя по токену (если нужно)
  async function fetchMe() {
    if (!token.value) return
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    if (res.ok) {
      user.value = await res.json()
    } else {
      logout()
    }
  }

  return { user, token, login, register, logout, fetchMe }
})
