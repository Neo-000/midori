// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  { path: '/', name: 'Menu', component: () => import('../pages/MenuPage.vue') },
  { path: '/cart', name: 'Cart', component: () => import('../pages/CartPage.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../pages/ProfilePage.vue') },
  { path: '/delivery', name: 'Delivery', component: () => import('../pages/DeliveryPage.vue') },
  { path: '/about', name: 'About', component: () => import('../pages/AboutPage.vue') },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/AdminPage.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ---- ДОБАВЬ ЭТОТ КОД для защиты админки ----
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  // Если переходим на админку
  if (to.meta.requiresAdmin) {
    // Если токен есть, но нет пользователя (перезагрузка, например) — подтягиваем пользователя
    if (auth.token && !auth.user) {
      await auth.fetchMe()
    }
    // Если есть юзер и это админ — пускаем
    if (auth.user && auth.user.role === 'admin') {
      next()
    } else {
      // Иначе редиректим на главную (или показывай ошибку)
      next('/')
    }
    return
  }
  next()
})

export default router
