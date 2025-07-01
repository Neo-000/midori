import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Menu', component: () => import('../pages/MenuPage.vue') },
  { path: '/cart', name: 'Cart', component: () => import('../pages/CartPage.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../pages/ProfilePage.vue') },
  { path: '/delivery', name: 'Delivery', component: () => import('../pages/DeliveryPage.vue') },
  { path: '/about', name: 'About', component: () => import('../pages/AboutPage.vue') },
  // { path: '/admin', name: 'Admin', component: () => import('../pages/AdminPage.vue') }, // потом
]

export default createRouter({
  history: createWebHistory(),
  routes,
})