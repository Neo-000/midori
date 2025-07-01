<template>
  <Container>
    <div class="product-list-title">
      <h1 v-if="!currentCategory">Все блюда</h1>
      <h1 v-else>Категория: {{ currentCategory }}</h1>
    </div>
    <div class="product-list">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
      <div v-if="filteredProducts.length === 0" class="no-items">
        Нет товаров в этой категории
      </div>
    </div>
  </Container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import products from '../mock/products.json'
import ProductCard from '../components/ProductCard.vue'
import Container from '../components/Container.vue'

// Категория из query (?category=)
const route = useRoute()
const currentCategory = computed(() => route.query.category || null)

// Фильтрация по категории
const filteredProducts = computed(() => {
  if (!currentCategory.value) return products
  return products.filter(p => p.category === currentCategory.value)
})
</script>

<style scoped>
.product-list-title {
  margin-bottom: 32px;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 32px;
}
.no-items {
  font-size: 18px;
  color: #999;
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 48px;
}
</style>
