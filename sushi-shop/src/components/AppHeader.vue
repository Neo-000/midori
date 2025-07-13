<template>
  <div class="topbar">
    <div class="topbar-left">
      <el-icon><Location /></el-icon>
      <span>{{ $t('delivery') }}</span>
      <!-- Кнопка выбрать адрес -->
      <el-button
        link
        style="margin-left:12px;font-size:15px;padding:0"
        @click="addressModal = true"
      >
        {{ selectedAddress ? selectedAddress : $t('choose_address') }}
      </el-button>
    </div>
    <div class="topbar-right">
      <img :src="flagSrc(currentLocale)" height="16" style="margin-right:5px;" />
      <el-dropdown trigger="click" @command="changeLocale">
        <span class="lang-dropdown">{{ currentLocale.toUpperCase() }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="loc in locales"
              :key="loc"
              :command="loc"
            >
              {{ loc.toUpperCase() }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <el-header class="main-header">
    <div class="header-logo-block">
      <img src="/src/assets/logo.svg" alt="Midori Sushi" class="header-logo-img" />
    </div>
    <div class="header-info">
      <span class="header-phone">{{ $t('phone') }}</span>
      <template v-if="auth.user">
        <el-dropdown>
          <span class="header-user" style="cursor:pointer">
            {{ auth.user.name || auth.user.email }}
            <el-icon><User /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">{{ $t('profile') }}</el-dropdown-item>
              <el-dropdown-item @click="auth.logout">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <el-button
        v-else
        class="header-login-btn"
        type="default"
        @click="loginModal = true"
        style="margin-left:10px;"
      >
        <el-icon><User /></el-icon> {{ $t('login') }}
      </el-button>
    </div>
    <div class="header-spacer"></div>
    <el-button
      v-if="!isMobile"
      type="primary"
      class="header-cart-btn"
      round
      @click="$router.push('/cart')"
    >
      <el-icon><ShoppingCartFull /></el-icon>
      <span class="cart-btn-label">{{ $t('cart') }}</span>
    </el-button>
  </el-header>

  <div class="header-mobile-actions" v-if="isMobile">
    <button class="burger-btn custom-burger" @click="drawer = true" aria-label="Открыть меню">
      <svg viewBox="0 0 64 64" width="40" height="40">
        <circle cx="32" cy="32" r="32" fill="#222" />
        <rect x="16" y="20" width="32" height="5" rx="2.5" fill="#fff"/>
        <rect x="16" y="29.5" width="32" height="5" rx="2.5" fill="#fff"/>
        <rect x="16" y="39" width="32" height="5" rx="2.5" fill="#fff"/>
      </svg>
    </button>
    <div style="flex: 1"></div>
    <el-button
      type="primary"
      class="header-cart-btn"
      round
      @click="$router.push('/cart')"
    >
      <el-icon><ShoppingCartFull /></el-icon>
    </el-button>
  </div>

  <div class="nav-menu">
    <el-button link class="nav-link" @click="$router.push('/')" :class="{active: isActive('/')}">
      {{ $t('main') }}
    </el-button>
    <el-button link class="nav-link" @click="$router.push('/delivery')" :class="{active: isActive('/delivery')}">
      {{ $t('delivery') }}
    </el-button>
    <el-button link class="nav-link" @click="$router.push('/about')" :class="{active: isActive('/about')}">
      {{ $t('about') }}
    </el-button>
    <el-button
     v-if="auth.user && auth.user.role === 'user'"
      link
      class="nav-link"
      @click="$router.push('/profile')"
      :class="{active: isActive('/profile')}">
      {{ $t('personal_cabinet') }}
    </el-button>
    <el-button
      v-if="auth.user && auth.user.role === 'admin'"
      style="margin-left:16px;"
      @click="$router.push('/admin')"
    >
      <el-icon><Menu /></el-icon>
      <span class="admin-btn-label">{{ $t('admin_panel') }}</span>
    </el-button>
    <el-dropdown
      v-if="!isMobile"
      trigger="click"
      @command="onSelectCategory"
      :hide-on-click="true"
    >
      <el-button class="menu-btn" type="default">
        <el-icon><Menu /></el-icon>
        {{ $t('menu') }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="cat in categories"
            :key="cat._id"
            :command="cat._id"
          >
            {{ cat.name[currentLocale] }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <el-drawer
    v-model="drawer"
    direction="ltr"
    size="220px"
    :with-header="false"
    custom-class="categories-drawer"
  >
    <div class="drawer-title">{{ $t('choose_category') }}</div>
    <el-menu
      class="categories-menu"
      mode="vertical"
      @select="onDrawerSelect"
      :default-active="''"
    >
      <el-menu-item
        v-for="cat in categories"
        :key="cat._id"
        :index="cat._id"
      >
        {{ cat.name[currentLocale] }}
      </el-menu-item>
    </el-menu>
  </el-drawer>

  <!-- Модалка выбора адреса -->
  <ModalAddress
    v-model="addressModal"
    @addressSelected="onAddressSelected"
  />

  <!-- Модалка авторизации -->
  <LoginModal v-model="loginModal" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCartFull, User, Menu, Location } from '@element-plus/icons-vue'
import LoginModal from './LoginModal.vue'
import ModalAddress from './ModalAdress.vue' // Подключи модалку адреса!
import { getCategories } from '../api'
import { useAuthStore } from '../store/auth'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const locales = ['ru', 'rs']
const currentLocale = ref('ru')
const { locale } = useI18n()

function flagSrc(lang) {
  if (lang === 'ru') return 'https://flagcdn.com/h20/ru.png'
  if (lang === 'rs') return 'https://flagcdn.com/h20/rs.png'
  return ''
}
function changeLocale(loc) {
  currentLocale.value = loc
  locale.value = loc
}

const route = useRoute()
const router = useRouter()
const isMobile = ref(window.innerWidth < 700)
const drawer = ref(false)
const categories = ref([])

async function loadCategories() {
  categories.value = await getCategories()
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadCategories()
  // При инициализации вытаскиваем адрес из localStorage
  selectedAddress.value = localStorage.getItem('selectedAddress') || ''
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
function handleResize() {
  isMobile.value = window.innerWidth < 700
}
function isActive(path) {
  return route.path === path
}
function onSelectCategory(catId) {
  if (route.path === '/') {
    router.replace({ path: '/', query: { category: catId } })
  } else {
    router.push({ path: '/', query: { category: catId } })
  }
}
function onDrawerSelect(catId) {
  drawer.value = false
  onSelectCategory(catId)
}

const loginModal = ref(false)

// --------- Выбор адреса ----------
const addressModal = ref(false)
const selectedAddress = ref('')

function onAddressSelected(addrObj) {
  // Собираем строку (можно и по-своему)
  let str = addrObj.city
  if (addrObj.street) str += ', ' + addrObj.street
  if (addrObj.house) str += ' ' + addrObj.house
  if (addrObj.apartment) str += ', кв.' + addrObj.apartment
  if (addrObj.entrance) str += ', подъезд ' + addrObj.entrance
  selectedAddress.value = str
  localStorage.setItem('selectedAddress', str)
}
</script>


 <style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  height: 32px;
  padding: 0 24px;
  font-size: 14px;
  color: #444;
  max-width: 1320px;
  margin: 0 auto;
  box-sizing: border-box;
  z-index: 50;
  position: relative;
}
.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.main-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #ededed;
  max-width: 1320px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}
.header-logo-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
.header-logo-img {
  width: 170px;
  height: 48px;
  object-fit: contain;
  margin-right: 32px;
  display: block;
}

/* --- User и телефон: в ряд, а на мобилке столбиком --- */
.header-info {
  width: 100%;
  display: flex;
  flex-direction: row;      /* В ряд на десктопе */
  align-items: center;
  justify-content:space-between;
  gap: 12px;
  margin-left: 8px;
}
.header-phone {
  font-size: 17px;
  color: #444;
  white-space: nowrap;
}
.header-user {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: #444;
  white-space: nowrap;
  margin-top: 0;
}

.header-spacer {
  flex: 1;
}

/* Кнопка корзины */
.header-cart-btn {
  background: #409EFF;
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  margin-left: 8px;
  padding: 8px 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s;
  border-radius: 24px; /* десктоп — округлая */
}
.cart-btn-label {
  display: inline;
}

/* Бургер-меню: широкое и современное */
.burger-btn {
  background: #fff;
  border: 1.5px solid #d9ecff;
  color: #409EFF;
  transition: box-shadow 0.2s, border 0.18s, background 0.18s;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.09);
  margin-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  padding: 0 20px;
  height: 38px;
  min-width: 64px;
  border-radius: 11px;
}
.burger-btn:hover, .burger-btn:focus {
  background: #f0f8ff;
  /* border-color: #409EFF; */
  color: #3074c5;
  /* box-shadow: 0 4px 16px rgba(64, 158, 255, 0.13); */
}
.burger-btn .el-icon {
  transition: transform 0.15s;
}
.burger-btn:hover .el-icon {
  /* transform: scale(1.18) rotate(8deg); */
}

.header-mobile-actions {
  display: none;
}

.nav-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  background: #fff;
  border-bottom: 1px solid #ededed;
  font-size: 16px;
  gap: 18px;
  min-height: 48px;
  max-width: 1320px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: auto;
}

.menu-btn {
  font-weight: 500;
  font-size: 16px;
  margin-left: 14px;
  background: #f7f7f7;
  border: 1px solid #eee;
  color: #222;
  white-space: nowrap;
}
.nav-link {
  color: #222;
  font-size: 16px;
  font-weight: 500;
  margin: 0 2px;
  padding: 4px 14px;
  border-radius: 7px;
  transition: background 0.15s;
  white-space: nowrap;
}
.nav-link.active, .nav-link:hover {
  color: #409EFF;
  background: #f0f6fe;
}
.categories-drawer {
  padding: 0;
}
.drawer-title {
  font-size: 17px;
  font-weight: 600;
  padding: 20px 18px 8px 18px;
  color: #222;
  background: #fff;
}
.categories-menu {
  border-right: none;
  width: 100%;
  min-height: 1px;
}

/* --- МЕДИА-ЗАПРОСЫ --- */
@media (max-width: 900px) {
  .main-header,
  .nav-menu,
  .topbar {
    padding-left: 10px;
    padding-right: 10px;
    max-width: 100%;
  }
  .header-logo-img {
    width: 120px;
    height: 36px;
    margin-right: 14px;
  }
  .header-phone,
  .header-user {
    font-size: 15px;
  }
  .header-cart-btn {
    font-size: 13px;
    padding: 7px 12px;
  }
}
@media (max-width: 700px) {
  .topbar {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0 4px;
    max-width: 100vw;
    height: 34px;
  }
  .main-header {
    flex-direction: column;
    align-items: center;
    gap: 6px;
    height: auto;
    padding: 12px 0 10px 0;
  }
  .header-logo-block {
    width: 100%;
    justify-content: center;
    margin-bottom: 0;
  }
  .header-logo-img {
    width: 120px;
    height: 60px;
    margin: 0 auto 0 auto;
    display: block;
  }
  /* User/телефон — теперь вертикально друг под другом! */
  .header-info {
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin: 0;
  }
  .header-phone,
  .header-user {
    font-size: 17px;
    margin: 0;
  }
  .header-spacer,
  .cart-btn-label {
    display: none !important;
  }
  .header-mobile-actions {

    width: 100%;
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    gap: 0;
    margin: 8px 0 1rem 0;
  }
  /* Корзина на мобилке — прямоугольная */
  .header-cart-btn {
    width: 74px;
    height: 38px;
    min-width: 74px;
    max-width: 100px;
    padding: 0 12px;
    justify-content: center;
    border-radius: 9px !important;
    font-size: 19px;
    margin-left: 0;
    margin-right: 0;
    gap: 0;
  }
  /* Бургер-меню — тоже шире и прямоугольнее */
  .burger-btn {
    min-width: 74px;
    width: 92px;
    height: 38px;
    border-radius: 11px !important;
    font-size: 24px;
    padding: 0 22px;
  }
  .nav-menu {
    font-size: 14px;
    min-height: 38px;
    gap: 8px;
    padding: 0 2px;
  }
  .nav-link,
  .menu-btn {
    font-size: 14px;
    padding: 3px 7px;
    margin: 0 1px;
  }
  .menu-btn {
    display: none !important;
  }
  .burger-btn.custom-burger {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  width: 44px;
  height: 44px;
  margin-right: 0;
  margin-left: 4px;
  transition: box-shadow .14s;
  box-shadow: 0 2px 7px rgba(40,40,40,0.08);
}
.burger-btn.custom-burger:active {
  box-shadow: 0 4px 12px rgba(40,40,40,0.18);
}
}

@media (max-width: 410px) {
    .nav-menu {
      flex-wrap: wrap;
    font-size: 14px;
    min-height: 38px;
    gap: 8px;
    padding: 0 2px;
  }
}
</style>


