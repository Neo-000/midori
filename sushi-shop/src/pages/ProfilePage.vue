<template>
  <div class="cabinet">
    <div class="cabinet-header">
      <h2>{{ t('personal_cabinet') }}</h2>
      <span class="avatar">
        <svg width="54" height="54" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#339CFF"/>
          <circle cx="24" cy="19" r="8" fill="#fff"/>
          <ellipse cx="24" cy="38" rx="13" ry="8" fill="#fff"/>
          <circle cx="24" cy="19" r="8" stroke="#339CFF" stroke-width="2"/>
        </svg>
      </span>
    </div>

    <div class="cabinet-info">
      <div class="cabinet-row">
        <label class="cabinet-label">{{ t('name') }}</label>
        <input v-model="editData.name" :readonly="!editName" />
        <button class="icon-btn" @click="editName = true" v-if="!editName">
          <i class="icon-edit"></i>
        </button>
        <button class="icon-btn" @click="saveProfile('name')" v-if="editName">
          <i class="icon-save"></i>
        </button>
      </div>
      <div class="cabinet-row">
        <label class="cabinet-label">{{ t('phonee') }}</label>
        <input v-model="editData.phone" :readonly="!editPhone" />
        <button class="icon-btn" @click="editPhone = true" v-if="!editPhone">
          <i class="icon-edit"></i>
        </button>
        <button class="icon-btn" @click="saveProfile('phone')" v-if="editPhone">
          <i class="icon-save"></i>
        </button>
      </div>
    </div>

    <div class="cabinet-bonus">
      <span>{{ t('bonus_account', { bonus: profile.bonus }) }}</span>
      <div class="bonus-bar">
        <div class="bonus-fill" :style="{width: profile.bonus + '%'}"></div>
        <span class="bonus-value">{{ profile.bonus }}</span>
      </div>
      <ul class="bonus-desc">
        <li>{{ t('bonus_system') }}</li>
        <li v-for="line in bonusRules" :key="line">{{ line }}</li>
        <li>{{ t('bonus_1rub') }}</li>
        <li>{{ t('bonus_next') }}</li>
        <li>{{ t('bonus_more') }}</li>
      </ul>
    </div>

    <div class="cabinet-orders">
      <h3>{{ t('order_history') }}</h3>
      <div v-if="loadingOrders">{{ t('loading') }}</div>
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
                  <template v-if="order.status === 'completed'">✅ {{ t('delivered') }}</template>
                  <template v-else-if="order.status === 'canceled'">❌ {{ t('canceled') }}</template>
                  <template v-else>🟢 {{ t('in_progress') }}</template>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!orders.length" class="orders-empty">{{ t('no_orders') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { getMyOrdersApi, updateProfileApi, getProfileApi } from '../api'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const authStore = useAuthStore()

const profile = ref({
  name: '',
  phone: '',
  bonus: 0,
})
const editData = ref({
  name: '',
  phone: ''
})
const editName = ref(false)
const editPhone = ref(false)
const orders = ref([])
const loadingOrders = ref(true)

onMounted(async () => {
  try {
    // Всегда берём профиль из базы (всегда самый актуальный)
    const user = await getProfileApi()
    profile.value.name = user.name || ''
    profile.value.phone = user.phone || ''
    profile.value.bonus = user.bonus || 0
    editData.value.name = profile.value.name
    editData.value.phone = profile.value.phone
    // заодно обновить authStore.user, чтобы всё приложение было в едином состоянии
    authStore.user = { ...authStore.user, ...user }
  } catch (e) {
    // fallback, если что-то пошло не так
    profile.value.name = authStore.user?.name || ''
    profile.value.phone = authStore.user?.phone || ''
    profile.value.bonus = authStore.user?.bonus || 0
    editData.value.name = profile.value.name
    editData.value.phone = profile.value.phone
  }

  try {
    orders.value = await getMyOrdersApi()
  } catch {}
  loadingOrders.value = false
})

async function saveProfile(field) {
  try {
    await updateProfileApi({
      name: editData.value.name,
      phone: editData.value.phone
    })
    profile.value.name = editData.value.name
    profile.value.phone = editData.value.phone
    authStore.user.name = editData.value.name
    authStore.user.phone = editData.value.phone
    if (field === 'name') editName.value = false
    if (field === 'phone') editPhone.value = false
  } catch (e) {
    alert('Ошибка сохранения профиля')
  }
}

function orderDate(date) {
  return new Date(date).toLocaleDateString(locale.value === 'rs' ? 'sr-RS' : 'ru-RU')
}
function shortId(id) {
  return id ? id.slice(-4) : ''
}
const currencySign = computed(() => {
  return locale.value === 'rs' ? 'дин.' : '₽'
})
const bonusRules = computed(() => {
  const rules = t('bonus_rules')
  return Array.isArray(rules) ? rules : [rules]
})
</script>

<style scoped>
.cabinet {
  max-width: 700px;
  margin: 0 auto;
}
.cabinet-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.cabinet-header h2 {
  font-size: 2.2rem;
  margin: 0;
  font-weight: 500;
}
.avatar {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 50%;
}
.cabinet-info {
  margin-bottom: 28px;
}
.cabinet-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}
.cabinet-label {
  width: 110px;
  min-width: 70px;
  font-size: 1.25rem;
  font-weight: 400;
}
.cabinet-row input {
  flex: 1;
  font-size: 1.18rem;
  padding: 6px 11px;
  border-radius: 7px;
  border: 2px solid #d0d0d0;
  background: #fff;
  transition: border .18s;
}
.cabinet-row input:read-only {
  background: #fcfcfc;
  color: #222;
  border: 1.2px solid #eee;
}
.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.23em;
  padding: 3px 8px;
  margin-left: 2px;
  color: #222;
  transition: color .18s;
}
.icon-btn:active {
  color: #1a8cff;
}
.icon-edit::before {
  content: "✏️";
  font-style: normal;
}
.icon-save::before {
  content: "💾";
  font-style: normal;
}
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
