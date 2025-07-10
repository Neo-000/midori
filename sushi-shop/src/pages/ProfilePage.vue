<template>
  <div class="cabinet">
    <h2>
      Личный кабинет
      <span class="avatar"><i class="icon-user"></i></span>
    </h2>
    <div class="cabinet-info">
      <label>
        Имя
        <input v-model="profile.name" :readonly="!editName" />
        <button @click="editName = !editName">
          <i class="icon-edit"></i>
        </button>
      </label>
      <label>
        Телефон
        <input v-model="profile.phone" :readonly="!editPhone" />
        <button @click="editPhone = !editPhone">
          <i class="icon-edit"></i>
        </button>
      </label>
    </div>

    <div class="cabinet-bonus">
      <span>Бонусный счёт: <b>{{ profile.bonus }}</b></span>
      <div class="bonus-bar">
        <div class="bonus-fill" :style="{width: profile.bonus + '%'}"></div>
        <span class="bonus-value">{{ profile.bonus }}</span>
      </div>
      <ul class="bonus-desc">
        <li>💙 Бонусная система</li>
        <li>— Начисляем бонусы за каждый заказ:<br>
            до 1000 ₽ → <b>3%</b> бонусами<br>
            1000-3000 ₽ → <b>5%</b> бонусами<br>
            3000+ ₽ → <b>7%</b> бонусами
        </li>
        <li>— 1 бонус = 1 рубль.</li>
        <li>— Бонусами можно оплатить до 30% следующего заказа.</li>
        <li>— Чем больше сумма заказа — тем больше бонусов!</li>
      </ul>
    </div>

    <div class="cabinet-orders">
      <h3>История заказов:</h3>
      <div v-if="loadingOrders">Загрузка...</div>
      <div v-else>
        <table class="orders-history">
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td class="order-id">#{{ shortId(order._id) }}</td>
              <td class="order-date">{{ orderDate(order.createdAt) }}</td>
              <td class="order-items">
                <span v-for="item in order.products" :key="item.product._id">
                  {{ item.product.title }}
                  <span v-if="item !== order.products[order.products.length - 1]">, </span>
                </span>
              </td>
              <td class="order-total">{{ order.total }} ₽</td>
              <td class="order-status">
                <span :class="'st st-' + order.status">
                  <template v-if="order.status === 'completed'">✅ Доставлен</template>
                  <template v-else-if="order.status === 'canceled'">❌ Отменён</template>
                  <template v-else>🟢 В обработке</template>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!orders.length" class="orders-empty">Нет заказов</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { getMyOrdersApi, updateProfileApi } from '../api'

const profile = ref({
  name: '',
  phone: '',
  bonus: 0,
})
const editName = ref(false)
const editPhone = ref(false)
const orders = ref([])
const loadingOrders = ref(true)

// Импортируем пользователя из стора
const authStore = useAuthStore()

// Загрузка профиля и заказов
onMounted(async () => {
  // Предполагается, что профиль и бонусы есть в authStore
  profile.value.name = authStore.user?.name || ''
  profile.value.phone = authStore.user?.phone || ''
  profile.value.bonus = authStore.user?.bonus || 0

  try {
    orders.value = await getMyOrdersApi()
  } catch {}
  loadingOrders.value = false
})

// Сохраняем изменения профиля (доработай под свою логику)
async function saveProfile() {
  await updateProfileApi({ name: profile.value.name, phone: profile.value.phone })
  editName.value = false
  editPhone.value = false
}

// Форматируем дату заказа
function orderDate(date) {
  return new Date(date).toLocaleDateString('ru-RU')
}

// Сокращение ID (по желанию)
function shortId(id) {
  return id ? id.slice(-4) : ''
}
</script>

<style scoped>
.cabinet { max-width: 700px; margin: 0 auto; }
.cabinet-info label { display: flex; align-items: center; gap: 7px; margin-bottom: 12px; }
.cabinet-info input { font-size: 16px; padding: 6px 9px; border-radius: 7px; border: 1.2px solid #dedede; }
.cabinet-info button { background: none; border: none; cursor: pointer; font-size: 1.18em; color: #249eff; }
.cabinet-bonus { margin: 22px 0 18px 0; }
.bonus-bar { position: relative; height: 22px; background: #f5f6fa; border-radius: 8px; margin: 10px 0 14px; }
.bonus-fill { background: #299fff; border-radius: 8px; height: 100%; transition: width .2s; }
.bonus-value { position: absolute; left: 50%; top: 0; transform: translateX(-50%); color: #fff; font-weight: 600; }
.bonus-desc { color: #446; font-size: 13px; margin: 0 0 0 7px; }
.cabinet-orders { margin-top: 32px; }
.orders-history { width: 100%; border: 1.2px solid #e5e5e5; border-radius: 10px; font-size: 15px; background: #fff; }
.orders-history td { padding: 8px 9px; border-bottom: 1px solid #f2f2f2; }
.orders-history .order-id { color: #3495fd; font-weight: 600; }
.orders-history .order-status .st { font-size: 1.13em; font-weight: 500; }
.orders-history .st-completed { color: #22b648; }
.orders-history .st-canceled { color: #ff5e5e; }
.orders-history .st-pending,
.orders-history .st-in_progress { color: #249eff; }
.orders-empty { color: #999; margin: 30px 0; }
</style>
