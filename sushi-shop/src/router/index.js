import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import CartPage from '../views/CartPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import AdminPage from '../views/AdminPage.vue'

const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/cart', component: CartPage, name: 'Cart' },
  { path: '/login', component: LoginPage, name: 'Login' },
  { path: '/register', component: RegisterPage, name: 'Register' },
  { path: '/admin', component: AdminPage, name: 'Admin' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router