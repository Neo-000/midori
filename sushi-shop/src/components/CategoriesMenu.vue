<template>
  <el-menu
    class="categories-menu"
    :default-active="activeCategory"
    @select="onSelect"
    :router="true"
    mode="vertical"
  >
    <el-menu-item
      v-for="cat in categories"
      :key="cat"
      :index="cat"
    >
      {{ cat }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import categories from '../mock/categories.json'

const activeCategory = ref(categories[0])
const onSelect = (cat) => {
  activeCategory.value = cat
  // Можно эмитить наверх, чтобы фильтровать блюда
}
</script>

<style scoped>
.categories-menu {
  width: 220px;
  min-height: 400px;
  border-right: 1px solid #f1f1f1;
}
</style>
