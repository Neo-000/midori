<template>
  <Container>
    <h1>Корзина</h1>

    <!-- Вывод содержимого корзины -->
    <div v-if="cart.items.length">
      <div
        v-for="item in cart.items"
        :key="item.product._id"
        class="cart-item"
      >
        <span>{{ item.product.title }}</span>
        <div class="cart-qty">
          <button @click="decrement(item)">–</button>
          <span>{{ item.quantity }}</span>
          <button @click="increment(item)">+</button>
        </div>
        <span>{{ item.product.price * item.quantity }} ₽</span>
        <button @click="cart.remove(item.product._id)">Удалить</button>
      </div>
      <div class="cart-total"><b>Итого:</b> {{ cart.total }} ₽</div>
    </div>
    <div v-else class="cart-empty">
      Корзина пуста
    </div>

    <!-- Форма оформления заказа -->
    <form v-if="cart.items.length && !orderSuccess" @submit.prevent="handleOrder" class="order-form">
      <h2>Оформить заказ</h2>
      <input v-model="name" placeholder="Ваше имя" required />
      <input v-model="phone" placeholder="Телефон" required />
      <input v-model="address" placeholder="Адрес" required />
      <textarea v-model="comment" placeholder="Комментарий"></textarea>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Оформляем..." : "Оформить заказ" }}
      </button>
    </form>

    <div v-if="orderSuccess" class="order-success">
      <b>Спасибо! Ваш заказ оформлен.</b>
    </div>
  </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../store/cart'
import { createOrder } from '../api'
import Container from '../components/Container.vue'
import { useAuthStore } from '../store/auth'

const cart = useCartStore()
const auth = useAuthStore()
const name = ref('')
const phone = ref('')
const address = ref('')
const comment = ref('')
const isLoading = ref(false)
const orderSuccess = ref(false)

// --- Автозаполнение формы если пользователь залогинен ---
onMounted(() => {
  if (auth.user) {
    name.value = auth.user.name || ''
    phone.value = auth.user.phone || ''
    address.value = auth.user.address || ''
  }
})

// --- Редактирование количества товаров ---
function increment(item) {
  cart.add(item.product, 1)
}
function decrement(item) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    cart.remove(item.product._id)
  }
}

async function handleOrder() {
  isLoading.value = true
  try {
    await createOrder({
      name: name.value,
      phone: phone.value,
      address: address.value,
      comment: comment.value,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      total: cart.total
    })
    orderSuccess.value = true
    cart.clear()
    name.value = ''
    phone.value = ''
    address.value = ''
    comment.value = ''
  } catch (e) {
    alert('Ошибка оформления заказа')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.cart-qty {
  display: flex;
  align-items: center;
  gap: 5px;
}
.cart-qty button {
  background: #f3f5fb;
  color: #409EFF;
  border: 1px solid #d8e6f7;
  border-radius: 5px;
  width: 26px;
  height: 26px;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s;
}
.cart-qty button:hover {
  background: #e1efff;
}
.cart-total {
  font-size: 18px;
  margin-top: 20px;
  font-weight: bold;
}
.cart-empty {
  color: #888;
  margin: 40px 0;
}
.order-form {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
}
.order-success {
  margin: 40px 0 0 0;
  color: #3bc065;
  font-size: 21px;
}
input, textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}
button[type="submit"] {
  background: #409EFF;
  color: #fff;
  padding: 10px 0;
  border: none;
  border-radius: 7px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
button[type="submit"]:disabled {
  background: #b7dcfc;
  cursor: not-allowed;
}
button {
  background: transparent;
  color: #409EFF;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 7px;
  transition: color 0.15s;
}
button:hover {
  color: #1766aa;
}
</style>
