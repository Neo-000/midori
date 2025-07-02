<template>
  <Container>
    <h2>Панель администратора</h2>

    <!-- Категории -->
    <section>
      <h3>Категории</h3>
      <form @submit.prevent="addCategory">
        <input v-model="newCategory" placeholder="Новая категория" required />
        <button>Добавить</button>
      </form>
      <ul>
        <li v-for="cat in categories" :key="cat._id">
          {{ cat.name }}
        </li>
      </ul>
    </section>

    <!-- Товары -->
    <section>
      <h3>Товары</h3>
      <form @submit.prevent="addProduct" enctype="multipart/form-data">
        <input v-model="productTitle" placeholder="Название" required />
        <input v-model="productPrice" type="number" placeholder="Цена" required />
        <select v-model="productCategory">
          <option v-for="cat in categories" :value="cat._id">{{ cat.name }}</option>
        </select>
        <input type="file" @change="onFileChange" />
        <button>Добавить товар</button>
      </form>
      <ul>
        <li v-for="prod in products" :key="prod._id">
          {{ prod.title }} — {{ prod.price }}₽
          <img v-if="prod.image" :src="prod.image" style="max-width:60px;max-height:60px;" />
        </li>
      </ul>
    </section>
  </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { getCategories, getProducts, addCategoryApi, addProductApi } from '../api'

const auth = useAuthStore()

// Категории и товары
const categories = ref([])
const products = ref([])

// Данные для добавления категории
const newCategory = ref('')
const newCategoryFile = ref(null)

// Данные для добавления товара
const productTitle = ref('')
const productPrice = ref('')
const productCategory = ref('')
const productFile = ref(null)
const productDescription = ref('')

// Загрузка начальных данных
async function loadData() {
  categories.value = await getCategories()
  products.value = await getProducts()
  if (categories.value.length > 0) {
    productCategory.value = categories.value[0]._id
  }
}
onMounted(loadData)

// Добавить категорию
async function handleAddCategory() {
  try {
    await addCategoryApi(newCategory.value, newCategoryFile.value, auth.token)
    newCategory.value = ''
    newCategoryFile.value = null
    await loadData()
  } catch (e) {
    alert(e.message)
  }
}

// Добавить товар
async function handleAddProduct() {
  try {
    await addProductApi({
      title: productTitle.value,
      price: productPrice.value,
      category: productCategory.value,
      file: productFile.value,
      description: productDescription.value,
    }, auth.token)
    productTitle.value = ''
    productPrice.value = ''
    productCategory.value = categories.value[0]?._id || ''
    productFile.value = null
    productDescription.value = ''
    await loadData()
  } catch (e) {
    alert(e.message)
  }
}
</script>

