import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CartPage from '../views/CartPage.vue'
import AdminPage from '../views/AdminPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAdmin: true }
  },
  // Можно добавить еще роуты, например профиль и т.д.
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Глобальный guard для проверки isAdmin
router.beforeEach((to, from, next) => {
  // Проверяем нужен ли доступ только для админа
  if (to.meta.requiresAdmin) {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    // Если пользователь залогинен и isAdmin === true — пускаем
    if (user && user.isAdmin) {
      next()
    } else {
      // Иначе отправляем на главную
      next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router
