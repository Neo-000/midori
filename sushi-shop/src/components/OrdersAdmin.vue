<template>
  <div class="orders-admin">
    <h3>Заказы</h3>
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else>
      <table class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Покупатель</th>
            <th>Телефон</th>
            <th>Адрес</th>
            <th>Товары</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>Заказ #{{ order._id.slice(-6) }}</td>
            <td>
              <span :class="'status-badge status-' + order.status">
                {{ statusText(order.status) }}
              </span>
            </td>
            <td>
              <b>{{ order.name }}</b>
              <div v-if="order.user">@ {{ order.user?.email }}</div>
            </td>
            <td>{{ order.phone }}</td>
            <td>{{ order.address }}</td>
            <td>
              <div v-for="item in order.products" :key="item.product?._id">
                {{ item.product?.title }} × {{ item.quantity }}
              </div>
            </td>
            <td><b>{{ order.total }} ₽</b></td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <select v-model="order.status" @change="updateStatus(order)">
                <option value="pending">Ожидает</option>
                <option value="accepted">Принят</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершён</option>
                <option value="canceled">Отменён</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!orders.length" class="empty">Нет заказов</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrdersApi, updateOrderStatusApi } from '../api'

const orders = ref([])
const isLoading = ref(false)

function statusText(status) {
  switch (status) {
    case 'pending': return 'Ожидает оплаты'
    case 'accepted': return 'Принят'
    case 'in_progress': return 'В работе'
    case 'completed': return 'Завершён'
    case 'canceled': return 'Отменён'
    default: return status
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU')
}

async function loadOrders() {
  isLoading.value = true
  try {
    orders.value = await getOrdersApi()
  } catch (e) {
    alert('Ошибка получения заказов')
  }
  isLoading.value = false
}

async function updateStatus(order) {
  try {
    await updateOrderStatusApi(order._id, order.status)
    // Можно добавить всплывающее уведомление об успешном обновлении
  } catch {
    alert('Ошибка обновления статуса заказа')
  }
}

onMounted(loadOrders)
</script>

<style scoped>
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
  background: #fff;
  font-size: 15px;
}
.orders-table th, .orders-table td {
  border: 1px solid #e4eaf0;
  padding: 8px 10px;
  text-align: left;
}
.orders-table th {
  background: #f5f9fd;
  font-weight: 600;
}
.status-badge {
  display: inline-block;
  padding: 0.25em 0.8em;
  border-radius: 7px;
  font-size: 0.98em;
  color: #fff;
  font-weight: 500;
}
.status-pending { background: #444; }
.status-accepted { background: #3796f5; }
.status-in_progress { background: #ffa426; }
.status-completed { background: #3bc065; }
.status-canceled { background: #e74c3c; }
.loading { padding: 30px; color: #888; }
.empty { margin-top: 30px; color: #aaa; font-size: 1.12em; }
</style>
