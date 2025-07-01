<template>
  <!-- 1. Верхняя серая полоса -->
  <div class="topbar">
    <div class="topbar-left">
      <el-icon><i class="el-icon-location"></i></el-icon>
      <span>Выберите адрес доставки</span>
    </div>
    <div class="topbar-right">
      <img src="https://flagcdn.com/h20/ru.png" height="16" style="margin-right:5px;" />
      <el-dropdown>
        <span class="lang-dropdown">РУ</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>EN</el-dropdown-item>
            <el-dropdown-item>RS</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 2. Главная шапка -->
  <el-header class="main-header">
    <img src="/src/assets/logo.svg" alt="Midori Sushi" class="header-logo-img" />
    <span class="header-phone">+7 (900) 777-77-77</span>
    <span class="header-city">г. Краснодар</span>
    <div class="header-spacer"></div>
    <span class="header-user">
      User
      <el-icon><i class="el-icon-user"></i></el-icon>
    </span>
    <el-button type="primary" class="header-cart-btn" round @click="$router.push('/cart')">
      <el-icon><i class="el-icon-shopping-cart-full"></i></el-icon>
      Корзина
    </el-button>
  </el-header>

  <!-- 3. Горизонтальное меню с кнопкой Меню -->
  <div class="nav-menu">
    <el-dropdown
      trigger="click"
      @command="onSelectCategory"
      :hide-on-click="true"
    >
      <el-button class="menu-btn" type="default">
        <el-icon><i class="el-icon-menu"></i></el-icon>
        Меню
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="cat in categories"
            :key="cat"
            :command="cat"
          >
            {{ cat }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button link class="nav-link" @click="$router.push('/')" :class="{active: isActive('/')}">
      Главная
    </el-button>
    <el-button link class="nav-link" @click="$router.push('/delivery')" :class="{active: isActive('/delivery')}">
      Доставка
    </el-button>
    <el-button link class="nav-link" @click="$router.push('/about')" :class="{active: isActive('/about')}">
      О нас
    </el-button>
    <el-button link class="nav-link" @click="$router.push('/profile')" :class="{active: isActive('/profile')}">
      Личный кабинет
    </el-button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import categories from '../mock/categories.json'

const route = useRoute()
const router = useRouter()

// Проверяем активный роут для выделения кнопки
function isActive(path) {
  return route.path === path
}

// Переход на главную с выбранной категорией
function onSelectCategory(cat) {
  if (route.path === '/') {
    // если мы на главной — передай категорию через emit/pinia/route query (пример ниже)
    // Здесь пример через query-параметр:
    router.replace({ path: '/', query: { category: cat } })
  } else {
    // если не на главной — перейти на главную с категорией
    router.push({ path: '/', query: { category: cat } })
  }
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
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.main-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #ededed;
}
.header-logo-img {
  width: 170px;
  height: 48px;
  object-fit: contain;
  margin-right: 32px;
}
.header-phone {
  font-size: 17px;
  color: #444;
  margin-right: 18px;
}
.header-city {
  font-size: 17px;
  color: #444;
}
.header-spacer {
  flex: 1;
}
.header-user {
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: #444;
}
.header-cart-btn {
  background: #409EFF;
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  margin-left: 8px;
  padding: 8px 22px;
}

.nav-menu {
  display: flex;
  align-items: center;
  padding: 0 18px;
  background: #fff;
  border-bottom: 1px solid #ededed;
  font-size: 16px;
  gap: 18px;
  min-height: 48px;
}
.menu-btn {
  font-weight: 500;
  font-size: 16px;
  margin-right: 10px;
  background: #f7f7f7;
  border: 1px solid #eee;
  color: #222;
}
.nav-link {
  color: #222;
  font-size: 16px;
  font-weight: 500;
  margin: 0 2px;
  padding: 4px 14px;
  border-radius: 7px;
  transition: background 0.15s;
}
.nav-link.active, .nav-link:hover {
  color: #409EFF;
  background: #f0f6fe;
}
</style>
