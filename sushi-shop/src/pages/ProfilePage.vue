<template>
  <div class="cabinet">
    <h2>
      {{ $t('personal_cabinet') }}
      <span class="avatar"><i class="icon-user"></i></span>
    </h2>
    <div class="cabinet-info">
      <label>
        {{ $t('name') }}
        <input v-model="profile.name" :readonly="!editName" />
        <button @click="editName = !editName">
          <i class="icon-edit"></i>
        </button>
      </label>
      <label>
        {{ $t('phone') }}
        <input v-model="profile.phone" :readonly="!editPhone" />
        <button @click="editPhone = !editPhone">
          <i class="icon-edit"></i>
        </button>
      </label>
    </div>

    <div class="cabinet-bonus">
      <span v-html="bonusAccountText"></span>
      <div class="bonus-bar">
        <div class="bonus-fill" :style="{width: profile.bonus + '%'}"></div>
        <span class="bonus-value">{{ profile.bonus }}</span>
      </div>
      <ul class="bonus-desc">
        <li>{{ $t('bonus_system') }}</li>
        <li v-html="$t('bonus_rules')"></li>
        <li>{{ $t('bonus_1rub') }}</li>
        <li>{{ $t('bonus_next') }}</li>
        <li>{{ $t('bonus_more') }}</li>
      </ul>
    </div>

    <div class="cabinet-orders">
      <h3>{{ $t('order_history') }}</h3>
      <div v-if="loadingOrders">{{ $t('loading') }}</div>
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
              <td class="order-total">{{ order.total }} {{ currencySign }}</td>
              <td class="order-status">
                <span :class="'st st-' + order.status">
                  <template v-if="order.status === 'completed'">✅ {{ $t('delivered') }}</template>
                  <template v-else-if="order.status === 'canceled'">❌ {{ $t('canceled') }}</template>
                  <template v-else>🟢 {{ $t('in_progress') }}</template>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!orders.length" class="orders-empty">{{ $t('no_orders') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { getMyOrdersApi, updateProfileApi } from '../api'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const profile = ref({
  name: '',
  phone: '',
  bonus: 0,
})
const editName = ref(false)
const editPhone = ref(false)
const orders = ref([])
const loadingOrders = ref(true)

const authStore = useAuthStore()

// Загрузка профиля и заказов
onMounted(async () => {
  profile.value.name = authStore.user?.name || ''
  profile.value.phone = authStore.user?.phone || ''
  profile.value.bonus = authStore.user?.bonus || 0

  try {
    orders.value = await getMyOrdersApi()
  } catch {}
  loadingOrders.value = false
})

async function saveProfile() {
  await updateProfileApi({ name: profile.value.name, phone: profile.value.phone })
  editName.value = false
  editPhone.value = false
}

function orderDate(date) {
  return new Date(date).toLocaleDateString(locale.value === 'rs' ? 'sr-RS' : 'ru-RU')
}

function shortId(id) {
  return id ? id.slice(-4) : ''
}

// Динамический вывод валюты по локали
const currencySign = computed(() => {
  return locale.value === 'rs' ? 'дин.' : '₽'
})

// Текст для бонусного счёта с подстановкой
const bonusAccountText = computed(() => {
  return t('bonus_account', { bonus: profile.value.bonus })
})
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
