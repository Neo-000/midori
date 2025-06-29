<script setup>
import { ref } from 'vue'
import auth from './stores/auth'
import { useRouter } from 'vue-router'
import { User, ShoppingCart } from '@element-plus/icons-vue'
import AuthForm from './components/AuthForm.vue'

const router = useRouter()
const showAuthModal = ref(false)

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

function handleAdminLogin() {
  showAuthModal.value = false
  router.push('/admin')
}
</script>

<template>
  <div class="top-bar">
    <div class="top-bar__left">
      <img src="/logo.svg" alt="Лого" class="logo" />
      <span style="margin-left:10px;">Суши и Роллы <b style="color:#7b39e9">Краснодар</b></span>
      <span class="top-bar__phone">+7 (800) 333-33-23</span>
    </div>
    <div class="top-bar__right">
      <!-- Если залогинен — показываем имя, иначе иконку -->
      <template v-if="auth.user.value && auth.user.value.name">
        <span style="margin-right: 14px; font-weight: 500;">
          <el-icon style="vertical-align:-3px;"><User /></el-icon>
          {{ auth.user.value.name }}
        </span>
      </template>
      <el-button
        type="primary"
        circle
        @click="handleUserClick"
        style="margin-right: 12px;"
      >
        <el-icon><User /></el-icon>
      </el-button>
      <el-button type="primary" @click="handleCartClick" round>
        <el-icon><ShoppingCart /></el-icon>
        КОРЗИНА
      </el-button>
    </div>
  </div>

  <div class="nav-menu">
    <el-menu mode="horizontal" :default-active="'/'" background-color="#fff" text-color="#333" active-text-color="#7b39e9">
      <el-menu-item index="/">Лучшая цена без скидок</el-menu-item>
      <el-menu-item index="sets">Наборы</el-menu-item>
      <el-menu-item index="lunch">Обеды на удачу</el-menu-item>
      <el-menu-item index="onigiri">Онигири</el-menu-item>
      <el-menu-item index="rolls">Роллы и суши</el-menu-item>
      <el-menu-item index="premium">Премиум</el-menu-item>
      <el-menu-item index="tempura">Темпура</el-menu-item>
      <!-- ... -->
    </el-menu>
  </div>

  <el-main style="background:#fafafc; min-height: 70vh;">
    <router-view />
  </el-main>

  <!-- Модалка: вход/регистрация или профиль -->
  <el-dialog v-model="showAuthModal" width="400" :show-close="true" align-center>
    <template #default>
      <template v-if="!auth.user.value || !auth.user.value.name">
        <AuthForm 
          @success="showAuthModal = false"
          @admin-login="handleAdminLogin"
        />
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
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding: 8px 30px 8px 20px;
  height: 54px;
}
.top-bar__left {
  display: flex;
  align-items: center;
}
.top-bar__phone {
  margin-left: 20px;
  font-weight: 600;
  color: #7b39e9;
}
.top-bar__right {
  display: flex;
  align-items: center;
}
.logo {
  width: 38px;
  height: 38px;
}
.nav-menu {
  background: #fff;
  border-bottom: 1px solid #ececec;
  padding-left: 10px;
  position: sticky;
  top: 0;
  z-index: 99;
}
</style>
