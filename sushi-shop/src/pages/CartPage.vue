<template>
  <Container>
    <h1>{{ $t('cart') }}</h1>

    <!-- Вывод содержимого корзины -->
    <div v-if="cart.items.length">
      <div
        v-for="item in cart.items"
        :key="item.product._id"
        class="cart-item"
      >
        <!-- Картинка -->
        <span class="cart-img-wrap">
          <img
            v-if="item.product.image"
            :src="getImageUrl(item.product.image)"
            alt="img"
            class="cart-img"
          />
          <span v-else class="cart-img cart-img--placeholder"></span>
        </span>
        <!-- Название -->
        <span class="cart-title">{{ localizedTitle(item.product) }}</span>
        <!-- +/- -->
        <span class="cart-qty">
          <button @click="decrement(item)">–</button>
          <span>{{ item.quantity }}</span>
          <button @click="increment(item)">+</button>
        </span>
        <!-- Цена -->
        <span class="cart-price">{{ item.product.price * item.quantity }} {{ currencySign }}</span>
        <!-- Удалить -->
        <button class="cart-remove" @click="cart.remove(item.product._id)">
          {{ $t('remove') }}
        </button>
      </div>
      <div class="cart-total">
        <b>{{ $t('total') }}</b> {{ cart.total }} {{ currencySign }}
      </div>
    </div>
    <div v-else class="cart-empty">
      {{ $t('cart_empty') }}
    </div>

    <!-- Форма оформления заказа -->
    <form v-if="cart.items.length && !orderSuccess" @submit.prevent="handleOrder" class="order-form">
      <h2>{{ $t('checkout') }}</h2>
      <input v-model="name" :placeholder="$t('your_name')" required />
      <input v-model="phone" :placeholder="$t('phone')" required />
      <input v-model="address" :placeholder="$t('address')" required />
      <textarea v-model="comment" :placeholder="$t('comment')"></textarea>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? $t('processing') : $t('place_order') }}
      </button>
    </form>

    <div v-if="orderSuccess" class="order-success">
      <b>{{ $t('thanks') }}</b>
    </div>
  </Container>
</template>

<script setup>
import Container from '../components/Container.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useCartStore } from '../store/cart'
import { createOrder, getProfileApi } from '../api'
import { useAuthStore } from '../store/auth'
import { useI18n } from 'vue-i18n'
import { STATIC_BASE_URL } from '../constants'

const cart = useCartStore()
const auth = useAuthStore()
const { t, locale } = useI18n()

const name = ref('')
const phone = ref('')
const address = ref('')
const comment = ref('')
const isLoading = ref(false)
const orderSuccess = ref(false)

const currencySign = computed(() => {
  return locale.value === 'rs' ? 'дин.' : 'дин.'
})

function localizedTitle(product) {
  if (!product.title) return ''
  return product.title[locale.value] || product.title.ru || ''
}

function getImageUrl(img) {
  if (!img) return '/src/assets/default-dish.png'
  if (img.startsWith('/uploads')) return STATIC_BASE_URL + img
  if (img.startsWith('http')) return img
  return STATIC_BASE_URL + '/uploads/' + img
}

// Подгружаем адрес из localStorage при монтировании (если есть)
onMounted(async () => {
  const addr = localStorage.getItem('selectedAddress')
  if (addr) {
    address.value = addr
  }
  try {
    const user = await getProfileApi()
    name.value = user.name || ''
    phone.value = user.phone || ''
    // Только если address еще пустой, подгружаем из профиля пользователя
    if (!address.value && user.address) {
      address.value = user.address
    }
    auth.user = { ...auth.user, ...user }
  } catch (e) {
    // Можно залогировать ошибку или проигнорировать
  }
})

// Следим за изменениями auth.user и автозаполняем только name и phone!
watch(
  () => auth.user,
  (user) => {
    if (user) {
      name.value = user.name || ''
      phone.value = user.phone || ''
      // address.value НЕ трогаем! Не мешаем локальному или введённому вручную
    }
  },
  { immediate: true }
)

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
    localStorage.setItem('selectedAddress', address.value)
    name.value = ''
    phone.value = ''
    address.value = ''
    comment.value = ''
  } catch (e) {
    alert(t('order_error'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  min-height: 60px;
}
.cart-img-wrap {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}
.cart-img {
  width: 46px;
  height: 46px;
  object-fit: cover;
  border-radius: 8px;
  background: #f4f4f4;
}
.cart-img--placeholder {
  background: #e0e0e0;
  width: 46px;
  height: 46px;
  display: inline-block;
  border-radius: 8px;
}
.cart-title {
  flex: 2 1 160px;
  font-size: 1.1rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 18px;
}
.cart-qty {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 92px;
  min-width: 92px;
  max-width: 92px;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 18px;
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
  flex-shrink: 0;
}
.cart-qty button:hover {
  background: #e1efff;
}
.cart-price {
  width: 90px;
  min-width: 90px;
  max-width: 90px;
  text-align: right;
  font-weight: 500;
  margin-right: 18px;
  flex-shrink: 0;
}
.cart-remove {
  min-width: 68px;
  color: #409EFF;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  text-align: left;
  transition: color 0.15s;
}
.cart-remove:hover {
  color: #1766aa;
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
/* ----- MOBILE ADAPTIVE ----- */
@media (max-width: 600px) {
  .cart-item {
    flex-wrap: wrap;
    gap: 6px;
    padding: 7px 0;
    min-height: unset;
  }
  .cart-img-wrap,
  .cart-img,
  .cart-img--placeholder {
    width: 38px;
    height: 38px;
    margin-right: 3px;
  }
  .cart-title {
    font-size: 0.98rem;
    max-width: 100px;
    margin-right: 8px;
  }
  .cart-qty {
    width: 70px;
    min-width: 70px;
    max-width: 70px;
    margin-right: 8px;
  }
  .cart-price {
    width: 54px;
    min-width: 54px;
    max-width: 54px;
    font-size: 0.99rem;
    margin-right: 8px;
  }
  .order-form {
    max-width: 100%;
  }
}
</style>
