import { reactive, readonly } from 'vue'

const state = reactive({
  items: []
})

function addToCart(product) {
  const existing = state.items.find(item => item.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    state.items.push({ ...product, quantity: 1 })
  }
}

function removeFromCart(productId) {
  const index = state.items.findIndex(item => item.id === productId)
  if (index !== -1) {
    state.items.splice(index, 1)
  }
}

function clearCart() {
  state.items = []
}

function updateQuantity(productId, quantity) {
  const item = state.items.find(i => i.id === productId)
  if (item) {
    item.quantity = quantity > 0 ? quantity : 1
  }
}

function getTotal() {
  return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export default {
  state: readonly(state),
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  getTotal
}
