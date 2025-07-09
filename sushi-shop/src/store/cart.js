// src/store/cart.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Загрузка из localStorage при старте
  const items = ref(
    JSON.parse(localStorage.getItem('cart_items') || '[]')
  )

  // Сохраняем в localStorage при каждом изменении корзины
  watch(items, (newVal) => {
    localStorage.setItem('cart_items', JSON.stringify(newVal))
  }, { deep: true })

  // Добавить товар (или увеличить количество)
  function add(product, quantity = 1) {
    if (!product || !product._id) return // простая защита
    const found = items.value.find(item => item.product._id === product._id)
    if (found) {
      found.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  // Удалить товар полностью
  function remove(productId) {
    items.value = items.value.filter(item => item.product._id !== productId)
  }

  // Очистить корзину
  function clear() {
    items.value = []
  }

  // Общая сумма заказа
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  )

  // Общее количество товаров
  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  return { items, add, remove, clear, total, count }
})
