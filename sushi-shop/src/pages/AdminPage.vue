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
import Container from '../components/Container.vue'
import { getCategories, addCategory, getProducts, addProduct } from '../api'
import { useAuthStore } from '../store/auth'
const auth = useAuthStore()

const categories = ref([])
const products = ref([])

const newCategory = ref('')
const productTitle = ref('')
const productPrice = ref('')
const productCategory = ref('')
const productFile = ref(null)

async function loadData() {
  categories.value = await getCategories()
  products.value = await getProducts()
}
onMounted(loadData)

async function addCategory() {
  await addCategoryApi(newCategory.value, auth.token)
  newCategory.value = ''
  loadData()
}

function onFileChange(e) {
  productFile.value = e.target.files[0]
}

async function addProduct() {
  const form = new FormData()
  form.append('title', productTitle.value)
  form.append('price', productPrice.value)
  form.append('category', productCategory.value)
  if (productFile.value) form.append('image', productFile.value)
  await addProductApi(form, auth.token)
  productTitle.value = ''
  productPrice.value = ''
  productCategory.value = ''
  productFile.value = null
  loadData()
}
</script>
