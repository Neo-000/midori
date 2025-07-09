<template>
  <div>
    <h3>Заказы</h3>
    <div v-if="loading" style="margin: 2rem 0;">Загрузка...</div>
    <div v-else-if="orders.length === 0" class="empty">Нет новых заказов</div>
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <div>
          <b>№{{ order._id.slice(-5) }}</b> 
          <span class="order-status" :class="'status-' + order.status">{{ order.status }}</span>
        </div>
        <div>
          <span><b>Имя:</b> {{ order.name }}</span> &nbsp;
          <span><b>Телефон:</b> {{ order.phone }}</span>
        </div>
        <div><b>Адрес:</b> {{ order.address }}</div>
        <div><b>Комментарий:</b> {{ order.comment }}</div>
        <div class="order-products">
          <div v-for="item in order.products" :key="item.product._id">
            {{ item.product.title }} × {{ item.quantity }}
          </div>
        </div>
        <div><b>Сумма:</b> {{ order.total }} ₽</div>
        <div><b>Создан:</b> {{ formatDate(order.createdAt) }}</div>
        <div class="order-actions">
          <select v-model="order.status" @change="updateStatus(order)">
            <option value="new">Новый</option>
            <option value="inprogress">В работе</option>
            <option value="done">Выполнен</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrdersApi, updateOrderStatusApi } from '../api'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  loading.value = true
  orders.value = await getOrdersApi()
  loading.value = false
}
async function updateStatus(order) {
  await updateOrderStatusApi(order._id, order.status)
  // можно показать уведомление
}

function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.orders-list {
  display: flex; flex-direction: column; gap: 1.6em;
}
.order-card {
  background: #fff; border-radius: 1em; padding: 1.2em 1.7em;
  box-shadow: 0 2px 12px #c6e4fa33;
  display: flex; flex-direction: column; gap: 0.5em;
}
.order-status { margin-left: 7px; }
.status-new { color: #409eff; }
.status-inprogress { color: #f29d21; }
.status-done { color: #44b86b; }
.order-products { font-size: 1em; margin-top: 0.5em; margin-bottom: 0.5em; }
.order-actions { margin-top: 0.7em; }
.empty { color: #aaa; margin: 2.5em 0; }
</style>
