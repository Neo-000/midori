<template>
  <div>
    <h1>Корзина</h1>
    <el-table :data="cartItems" v-if="cartItems.length > 0">
      <el-table-column prop="name" label="Товар"></el-table-column>
      <el-table-column label="Количество" width="120">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" @change="updateQuantity(row.id, row.quantity)" :min="1" />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="Цена"></el-table-column>
      <el-table-column label="Сумма">
        <template #default="{ row }">
          {{ row.price * row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="120">
        <template #default="{ row }">
          <el-button type="danger" @click="removeFromCart(row.id)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>Корзина пуста</div>
    <div v-if="cartItems.length > 0" style="margin-top: 20px; text-align: right;">
      <h3>Итого: {{ total }} ₽</h3>
      <el-button type="success" @click="showOrderForm = true">Оформить заказ</el-button>
      <el-button @click="clearCart">Очистить</el-button>
    </div>

    <el-dialog v-model="showOrderForm" title="Оформление заказа">
      <el-form :model="orderForm">
        <el-form-item label="Имя">
          <el-input v-model="orderForm.customerName" />
        </el-form-item>
        <el-form-item label="Телефон">
          <el-input v-model="orderForm.phone" />
        </el-form-item>
        <el-form-item label="Адрес">
          <el-input v-model="orderForm.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showOrderForm = false">Отмена</el-button>
        <el-button type="primary" @click="submitOrder">Заказать</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import cart from '../stores/cart'
import axios from 'axios'

const showOrderForm = ref(false)
const orderForm = ref({
  customerName: '',
  phone: '',
  address: ''
})

const cartItems = cart.state.items

function updateQuantity(id, quantity) {
  cart.updateQuantity(id, quantity)
}

function removeFromCart(id) {
  cart.removeFromCart(id)
}

function clearCart() {
  cart.clearCart()
}

const total = computed(() => cart.getTotal())

async function submitOrder() {
  // Массив items для бэка
  const items = cartItems.map(item => ({
    product: item.id, // id товара
    quantity: item.quantity
  }))
  const orderData = {
    items,
    customerName: orderForm.value.customerName,
    phone: orderForm.value.phone,
    address: orderForm.value.address,
    totalPrice: total.value
  }
  try {
    await axios.post('http://localhost:5000/api/orders', orderData)
    cart.clearCart()
    showOrderForm.value = false
    alert('Заказ успешно оформлен!')
  } catch (e) {
    alert('Ошибка при оформлении заказа')
  }
}
</script>
