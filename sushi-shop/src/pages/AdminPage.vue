<template> 
  <div class="admin-page">
    <h2 class="admin-title">{{ $t('admin_panel') }}</h2>
    <div class="admin-tabs">
      <button :class="{active: tab === 'categories'}" @click="tab = 'categories'">{{ $t('categories') }}</button>
      <button :class="{active: tab === 'products'}" @click="tab = 'products'">{{ $t('products') }}</button>
      <button :class="{active: tab === 'orders'}" @click="tab = 'orders'">{{ $t('orders') }}</button>
    </div>
    <CategoriesAdmin v-if="tab === 'categories'" />
    <ProductsAdmin v-else-if="tab === 'products'" />
    <OrdersAdmin v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CategoriesAdmin from '../components/CategoriesAdmin.vue'
import ProductsAdmin from '../components/ProductsAdmin.vue'
import OrdersAdmin from '../components/OrdersAdmin.vue'

const tab = ref('categories')
</script>

<style scoped>
.admin-title {
  font-size: 1.45rem;
  font-weight: 600;
  margin-bottom: 1.7rem;
}
.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.7rem;
}
.admin-tabs button {
  padding: 0.6em 2.5em;
  border-radius: 10px;
  border: 1.5px solid #b3d4fc;
  font-size: 1.13em;
  font-weight: 500;
  background: #f8fbff;
  color: #2186eb;
  cursor: pointer;
  transition: background 0.15s;
}
.admin-tabs button.active,
.admin-tabs button:focus {
  background: #4ca4ff;
  color: #fff;
  border-color: #2186eb;
}
</style>
