<template> 
  <Container>
    <div class="product-list-title">
      <h1 v-if="!currentCategory">{{ $t('all_categories') }}</h1>
      <h1 v-else>
        {{ $t('category') }}: {{ currentCategoryName }}
      </h1>
    </div>
    <div class="product-list">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
      />
      <div v-if="products.length === 0" class="no-items">
        {{ $t('no_items_in_category') }}
      </div>
    </div>
  </Container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCategories, getProducts } from '../api'
import { useI18n } from 'vue-i18n'
import ProductCard from '../components/ProductCard.vue'
import Container from '../components/Container.vue'

const route = useRoute()
const { locale } = useI18n()

const categories = ref([])
const products = ref([])

const currentCategory = computed(() => route.query.category || null)

// Корректная локализация названия категории!
const currentCategoryName = computed(() => {
  if (!currentCategory.value) return ''
  const cat = categories.value.find(c => c._id === currentCategory.value)
  if (!cat) return ''
  if (typeof cat.name === 'object' && cat.name !== null) {
    return cat.name[locale.value] || cat.name.ru || ''
  }
  return cat.name || ''
})

async function loadCategories() {
  categories.value = await getCategories()
}
async function loadProducts() {
  products.value = await getProducts(currentCategory.value)
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})

watch(() => route.query.category, async () => {
  await loadProducts()
})
</script>

<style scoped>
.product-list-title {
  margin-bottom: 32px;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2em 1.3em; /* по вертикали и горизонтали */
  width: 100%;
  margin: 0 auto;
  /* Убери max-width если не хочешь центрирования */
}
.no-items {
  font-size: 18px;
  color: #999;
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 48px;
}
</style>
