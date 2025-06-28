import { ref } from 'vue'

const token = ref(localStorage.getItem('token') || '')
const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

function login(tokenValue, userValue) {
  token.value = tokenValue
  user.value = userValue
  localStorage.setItem('token', tokenValue)
  localStorage.setItem('user', JSON.stringify(userValue))
}

function logout() {
  token.value = ''
  user.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default {
  token,
  user,
  login,
  logout,
}
