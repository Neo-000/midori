<template>
  <div class="admin-page">
    <h2 class="admin-title">Панель администратора</h2>

    <div class="admin-grid">
      <!-- Категории -->
      <section class="admin-section">
        <h3>Категории</h3>
        <form class="admin-form" @submit.prevent="handleAddCategory">
          <label>
            <span>Название категории</span>
            <input v-model="newCategory" placeholder="Новая категория" required />
          </label>
          <button type="submit" :disabled="isAddingCat">
            {{ isAddingCat ? 'Добавление...' : 'Добавить' }}
          </button>
        </form>
        <ul class="admin-list">
          <li v-for="cat in categories" :key="cat._id">
            {{ cat.name }}
          </li>
        </ul>
      </section>

      <!-- Товары -->
      <section class="admin-section">
        <h3>Товары</h3>
        <form class="admin-form" @submit.prevent="handleAddProduct" enctype="multipart/form-data">
          <label>
            <span>Название</span>
            <input v-model="productTitle" placeholder="Название" required />
          </label>
          <label>
            <span>Цена</span>
            <input v-model="productPrice" type="number" placeholder="Цена" required />
          </label>
          <label>
            <span>Категория</span>
            <select v-model="productCategory">
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
            </select>
          </label>
          <label>
            <span>Изображение</span>
            <input type="file" @change="onProductFileChange" />
          </label>
          <label>
            <span>Описание</span>
            <textarea v-model="productDescription" placeholder="Описание"></textarea>
          </label>
          <button type="submit" :disabled="isAddingProd">
            {{ isAddingProd ? 'Добавление...' : 'Добавить товар' }}
          </button>
        </form>
        <ul class="admin-list">
          <li v-for="prod in products" :key="prod._id" class="prod-item">
            <img v-if="prod.image" :src="prod.image" alt="" class="prod-img" />
            <div>
              <div class="prod-title">{{ prod.title }}</div>
              <div class="prod-price">{{ prod.price }}₽</div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { getCategories, getProducts, addCategoryApi, addProductApi } from '../api'

const auth = useAuthStore()
const categories = ref([])
const products = ref([])

const newCategory = ref('')
const newCategoryFile = ref(null)

const productTitle = ref('')
const productPrice = ref('')
const productCategory = ref('')
const productFile = ref(null)
const productDescription = ref('')

const isAddingCat = ref(false)
const isAddingProd = ref(false)

// Init
async function loadData() {
  categories.value = await getCategories()
  products.value = await getProducts()
  if (categories.value.length > 0) {
    productCategory.value = categories.value[0]._id
  }
}
onMounted(loadData)

// Файлы
function onProductFileChange(e) {
  productFile.value = e.target.files[0]
}

// Категория
async function handleAddCategory() {
  if (!newCategory.value) return
  isAddingCat.value = true
  try {
    await addCategoryApi(newCategory.value, newCategoryFile.value, auth.token)
    newCategory.value = ''
    newCategoryFile.value = null
    await loadData()
  } catch (e) {
    alert(e.message)
  }
  isAddingCat.value = false
}

// Товар
async function handleAddProduct() {
  if (!productTitle.value || !productPrice.value || !productCategory.value) return
  isAddingProd.value = true
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
  isAddingProd.value = false
}
</script>

<style scoped>
.admin-page {
  padding: 2rem 1rem 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f7f9fa;
  min-height: 100vh;
}
.admin-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
  color: #222;
}
.admin-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem 4vw;
  align-items: flex-start;
}
.admin-section {
  flex: 1 1 330px;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 14px 0 #c4d3e64c;
  padding: 2rem 1.4rem;
  min-width: 320px;
}
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 2rem;
}
.admin-form label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1rem;
}
.admin-form input,
.admin-form select,
.admin-form textarea {
  padding: 0.65em 1em;
  font-size: 1rem;
  border: 1px solid #c7d0df;
  border-radius: 0.5em;
  background: #f9fbfd;
  resize: none;
}
.admin-form button {
  align-self: flex-end;
  background: #409eff;
  color: #fff;
  font-weight: 600;
  font-size: 1.06em;
  padding: 0.5em 1.7em;
  border: none;
  border-radius: 0.6em;
  cursor: pointer;
  transition: background .13s;
}
.admin-form button[disabled] {
  background: #b1c2d8;
  cursor: not-allowed;
}

.admin-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.prod-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  min-height: 70px;
}
.prod-img {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 0.4em;
  background: #fff;
  border: 1px solid #e6e9f2;
}
.prod-title {
  font-size: 1.1em;
  font-weight: 500;
}
.prod-price {
  color: #409eff;
  font-weight: 600;
  font-size: 1em;
}
@media (max-width: 800px) {
  .admin-grid {
    flex-direction: column;
    gap: 2rem;
  }
  .admin-section {
    min-width: 0;
    width: 100%;
  }
}
</style>
