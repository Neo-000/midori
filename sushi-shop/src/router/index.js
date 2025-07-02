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

// Глобальная защита роутов для админки
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Проверка: если нужно быть админом, а пользователь не админ — не пускать
  if (to.meta.requiresAdmin) {
    // Проверяем роль (или email, если роль не используется)
    if (!auth.user || (auth.user.role !== 'admin')) {
      // Редирект на главную или show 403
      return next('/')
    }
  }
  next()
})

export default router
