// src/store/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Массив товаров в корзине
  const items = ref([]) // [{ product: {...}, quantity: N }]

  // Добавить товар (или увеличить количество)
  function add(product, quantity = 1) {
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

  // Общее количество товаров (если нужно)
  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  return { items, add, remove, clear, total, count }
})
