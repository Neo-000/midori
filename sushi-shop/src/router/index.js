import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AdminPage from '../views/AdminPage.vue'
// ... другие импорты

import auth from '../stores/auth'

const routes = [
  { path: '/', component: HomePage },
  { path: '/admin', component: AdminPage },
  // ... твои остальные маршруты
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    if (auth.user.value && auth.user.value.isAdmin) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
