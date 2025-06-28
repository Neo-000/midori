<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import auth from './stores/auth'
import { useRouter } from 'vue-router'
import { User, ShoppingCart, Menu } from '@element-plus/icons-vue'
import AuthForm from './components/AuthForm.vue'

const router = useRouter()
const showAuthModal = ref(false)
const categories = ref([])
const mobileMenu = ref(false)

// Получение категорий с бэка
async function fetchCategories() {
  try {
    const { data } = await axios.get('http://localhost:5000/api/categories')
    categories.value = data
  } catch (err) {
    categories.value = []
  }
}

onMounted(fetchCategories)

function handleUserClick() {
  showAuthModal.value = true
}
function handleCartClick() {
  router.push('/cart')
}
function handleLogout() {
  auth.logout()
  showAuthModal.value = false
  router.push('/')
}
function gotoProfile() {
  router.push('/profile')
  showAuthModal.value = false
}

function handleCategoryClick(id) {
  // Сделай роутинг как тебе надо
  // router.push(`/category/${id}`)
  mobileMenu.value = false
}
</script>

<template>
  <header class="top-bar">
    <!-- Бургер только на мобилках -->
    <div class="top-bar__mobileburger" @click="mobileMenu = true">
      <el-icon><Menu /></el-icon>
    </div>
    <div class="top-bar__left">
      <img src="/logo.svg" alt="Лого" class="logo" />
    </div>
    <div class="top-bar__contacts">
      <span class="top-bar__phone">+7 (800) 333-33-23</span>
      <a
        href="https://www.instagram.com/midorisushi.novisad"
        class="insta-link"
        target="_blank"
        rel="noopener"
        title="Мы в Instagram"
      >
        <!-- SVG Инстаграма с оригинальным градиентом -->
        <svg class="insta-svg" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="insta-gradient" cx="0.3" cy="0.3" r="1.2">
              <stop offset="0%" stop-color="#fdf497"/>
              <stop offset="45%" stop-color="#fdf497"/>
              <stop offset="60%" stop-color="#fd5949"/>
              <stop offset="90%" stop-color="#d6249f"/>
              <stop offset="100%" stop-color="#285AEB"/>
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#insta-gradient)"/>
          <circle cx="16" cy="16" r="7" fill="#fff"/>
          <circle cx="24" cy="9" r="1.5" fill="#fff"/>
        </svg>
      </a>
    </div>
    <div class="top-bar__right">
      <template v-if="auth.user.value && auth.user.value.name">
        <span class="username">
          <el-icon style="vertical-align:-3px;"><User /></el-icon>
          {{ auth.user.value.name }}
        </span>
      </template>
      <el-button type="primary" circle @click="handleUserClick" style="margin-right:12px;">
        <el-icon><User /></el-icon>
      </el-button>
      <el-button type="primary" @click="handleCartClick" round>
        <el-icon><ShoppingCart /></el-icon>
        КОРЗИНА
      </el-button>
    </div>
  </header>

  <!-- Меню категорий -->
  <nav class="nav-menu">
    <el-menu
      mode="horizontal"
      :default-active="'/'"
      background-color="#fff"
      text-color="#333"
      active-text-color="#7b39e9"
    >
      <el-menu-item
        v-for="cat in categories"
        :key="cat._id"
        :index="cat._id"
        @click="handleCategoryClick(cat._id)"
      >
        {{ cat.name }}
      </el-menu-item>
    </el-menu>
  </nav>

  <!-- Мобильное меню Drawer -->
  <el-drawer v-model="mobileMenu" direction="ltr" size="85vw" class="mobile-menu">
    <div class="mobile-menu-header">
      <img src="/logo.svg" alt="Лого" class="logo-mobile" />
      <el-icon style="margin-left:auto;" @click="mobileMenu=false"><Menu /></el-icon>
    </div>
    <div class="mobile-menu-contacts">
      <span class="top-bar__phone">+7 (800) 333-33-23</span>
      <a
        href="https://www.instagram.com/midorisushi.novisad"
        class="insta-link"
        target="_blank"
        rel="noopener"
        title="Мы в Instagram"
      >
        <svg class="insta-svg" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="insta-gradient-mobile" cx="0.3" cy="0.3" r="1.2">
              <stop offset="0%" stop-color="#fdf497"/>
              <stop offset="45%" stop-color="#fdf497"/>
              <stop offset="60%" stop-color="#fd5949"/>
              <stop offset="90%" stop-color="#d6249f"/>
              <stop offset="100%" stop-color="#285AEB"/>
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#insta-gradient-mobile)"/>
          <circle cx="16" cy="16" r="7" fill="#fff"/>
          <circle cx="24" cy="9" r="1.5" fill="#fff"/>
        </svg>
      </a>
    </div>
    <el-menu
      mode="vertical"
      background-color="#fff"
      text-color="#333"
      active-text-color="#7b39e9"
      class="mobile-cats"
    >
      <el-menu-item
        v-for="cat in categories"
        :key="cat._id"
        :index="cat._id"
        @click="handleCategoryClick(cat._id)"
      >
        {{ cat.name }}
      </el-menu-item>
    </el-menu>
  </el-drawer>

  <el-main style="background:#fafafc; min-height: 70vh;">
    <router-view />
  </el-main>

  <el-dialog v-model="showAuthModal" width="400" :show-close="true" align-center>
    <template #default>
      <template v-if="!auth.user.value || !auth.user.value.name">
        <AuthForm @success="showAuthModal = false" />
      </template>
      <template v-else>
        <div style="text-align:center;padding:24px 0;">
          <el-icon size="50" color="#7b39e9"><User /></el-icon>
          <h2 style="margin:16px 0 8px;">Здравствуйте, {{ auth.user.value.name }}!</h2>
          <el-button type="primary" @click="gotoProfile" style="width:90%;margin-bottom:12px;">
            Личный кабинет
          </el-button>
          <el-button type="danger" @click="handleLogout" style="width:90%;">
            Выйти
          </el-button>
        </div>
      </template>
    </template>
  </el-dialog>
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding: 1em 2em 1em 1.5em;
  position: relative;
}
.top-bar__mobileburger {
  display: none;
  font-size: 2.2em;
  margin-right: 0.8em;
  cursor: pointer;
}
.logo {
  width: 12em;
  height: 4.4em;
  max-width: 100vw;
  display: block;
}
.top-bar__contacts {
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-left: 2em;
}
.insta-link {
  display: inline-block;
  margin-left: 1em;
}
.insta-svg {
  width: 2em;
  height: 2em;
}
.top-bar__right {
  display: flex;
  align-items: center;
}
.username {
  margin-right: 14px;
  font-weight: 500;
}
.nav-menu {
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding-left: 1em;
  position: sticky;
  top: 0;
  z-index: 99;
}
.mobile-menu {
  padding: 0;
}
.mobile-menu-header {
  display: flex;
  align-items: center;
  padding: 1em;
}
.logo-mobile {
  width: 10em;
  height: 3.6em;
  display: block;
  margin: 0 auto;
}
.mobile-menu-contacts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  padding: 1em 0 0 0;
}
.mobile-cats {
  margin-top: 1em;
}
@media (max-width: 900px) {
  .top-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5em 0.7em 0.5em 0.7em;
  }
  .top-bar__left {
    justify-content: center;
    width: 100%;
  }
  .logo {
    margin: 0 auto 0.7em auto;
    display: block;
  }
  .top-bar__contacts {
    justify-content: center;
    margin: 0 0 0.7em 0;
    width: 100%;
  }
  .top-bar__right {
    justify-content: center;
    width: 100%;
    margin-top: 0.3em;
  }
  .top-bar__mobileburger {
    display: block;
    position: absolute;
    left: 1em;
    top: 1.2em;
    z-index: 1001;
  }
  .nav-menu {
    display: none;
  }
}
</style>
