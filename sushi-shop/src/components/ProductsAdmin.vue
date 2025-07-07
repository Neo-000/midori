<template>
  <div class="products-admin">
    <div class="products-header">
      <div class="category-filter">
        <span>Выберите категорию</span>
        <select v-model="selectedCatId" @change="loadProducts">
          <option value="">Все категории</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
      </div>
      <button class="add-product-btn" @click="showModal = true">
        Новый товар <span>+</span>
      </button>
    </div>
    <div class="products-list">
      <div v-for="prod in products" :key="prod._id" class="product-card">
        <img v-if="prod.image" :src="prod.image" class="prod-img" />
        <div class="prod-info">
          <div class="prod-title-row">
            <b>{{ prod.title }}</b>
            <span class="prod-weight">{{ prod.weight ? prod.weight + ' г' : '' }}</span>
          </div>
          <div class="prod-desc">{{ prod.description }}</div>
          <div class="prod-price">{{ prod.price }} ₽</div>
        </div>
        <div class="prod-actions">
          <button @click="editProduct(prod)">✏️</button>
          <button @click="deleteProduct(prod)">🗑️</button>
        </div>
      </div>
    </div>
    <!-- Модалка для добавления/редактирования товара -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-window">
        <h4>{{ editMode ? 'Редактировать' : 'Добавить' }} товар</h4>
        <form @submit.prevent="saveProduct">
          <input v-model="modalTitle" placeholder="Название" required />
          <input v-model="modalPrice" placeholder="Цена" type="number" required />
          <input v-model="modalWeight" placeholder="Вес (грамм)" type="number" />
          <textarea v-model="modalDesc" placeholder="Описание"></textarea>
          <select v-model="modalCategory">
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
          <input type="file" @change="onFileChange" />
          <div class="modal-btns">
            <button type="submit">{{ editMode ? 'Сохранить' : 'Добавить' }}</button>
            <button type="button" @click="closeModal">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCategories, getProducts, addProductApi, updateProductApi, deleteProductApi } from '../api'

const categories = ref([])
const products = ref([])
const selectedCatId = ref('')
const showModal = ref(false)
const editMode = ref(false)
const editProductId = ref(null)

// Поля для формы модалки
const modalTitle = ref('')
const modalPrice = ref('')
const modalWeight = ref('')
const modalDesc = ref('')
const modalCategory = ref('')
const modalFile = ref(null)

async function loadCategories() {
  categories.value = await getCategories()
}
async function loadProducts() {
  products.value = await getProducts(selectedCatId.value)
}
onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
watch(selectedCatId, loadProducts)

function closeModal() {
  showModal.value = false
  editMode.value = false
  editProductId.value = null
  modalTitle.value = ''
  modalPrice.value = ''
  modalWeight.value = ''
  modalDesc.value = ''
  modalCategory.value = categories.value[0]?._id || ''
  modalFile.value = null
}
function onFileChange(e) {
  modalFile.value = e.target.files[0]
}
function editProduct(prod) {
  editMode.value = true
  showModal.value = true
  editProductId.value = prod._id
  modalTitle.value = prod.title
  modalPrice.value = prod.price
  modalWeight.value = prod.weight || ''
  modalDesc.value = prod.description || ''
  modalCategory.value = prod.category || categories.value[0]?._id
}
async function saveProduct() {
  if (!modalTitle.value || !modalPrice.value || !modalCategory.value) return
  if (editMode.value) {
    await updateProductApi(editProductId.value, {
      title: modalTitle.value,
      price: modalPrice.value,
      weight: modalWeight.value,
      description: modalDesc.value,
      category: modalCategory.value,
      file: modalFile.value,
    })
  } else {
    await addProductApi({
      title: modalTitle.value,
      price: modalPrice.value,
      weight: modalWeight.value,
      description: modalDesc.value,
      category: modalCategory.value,
      file: modalFile.value,
    })
  }
  closeModal()
  await loadProducts()
}
async function deleteProduct(prod) {
  if (confirm(`Удалить товар "${prod.title}"?`)) {
    await deleteProductApi(prod._id)
    await loadProducts()
  }
}
</script>

<style scoped>
.products-header {
  display: flex;
  align-items: flex-end;
  gap: 2.2rem;
  margin-bottom: 1.7rem;
}
.category-filter {
  display: flex; flex-direction: column; gap: 0.5em;
}
.category-filter select {
  padding: 0.3em 1.2em; font-size: 1.12em;
  border-radius: 7px; border: 1.4px solid #d6e5f9;
}
.add-product-btn {
  background: #3796f5; color: #fff; border-radius: 8px; border: none;
  padding: 0.55em 1.7em; font-size: 1.13em; cursor: pointer; font-weight: 500;
  display: flex; align-items: center; gap: 0.7em;
  transition: background .12s;
}
.products-list {
  display: flex; flex-direction: column; gap: 1.2em;
}
.product-card {
  display: flex; align-items: stretch; gap: 1.2em; background: #fff;
  border-radius: 14px; border: 1.3px solid #dde6f4; padding: 1.1em 1.3em;
  box-shadow: 0 2px 6px 0 #e3ebf733;
}
.prod-img {
  width: 98px; height: 78px; object-fit: cover; border-radius: 8px;
  background: #eee;
}
.prod-info {
  flex: 1;
  display: flex; flex-direction: column; justify-content: center;
  gap: 0.5em;
}
.prod-title-row { display: flex; justify-content: space-between; align-items: flex-start; }
.prod-title-row b { font-size: 1.14em; }
.prod-weight { color: #9b9b9b; font-size: 0.95em; }
.prod-desc { color: #222; margin-bottom: 0.5em; }
.prod-price { font-weight: 600; font-size: 1.15em; color: #248fff; }
.prod-actions {
  display: flex; flex-direction: column; gap: 0.7em; justify-content: flex-start; align-items: flex-end;
  margin-left: 1em;
}
.prod-actions button {
  background: none; border: none; font-size: 1.5em; cursor: pointer;
  transition: color 0.13s;
}
.prod-actions button:hover { color: #2186eb; }

.modal-backdrop {
  position: fixed; inset: 0; background: #212d3a24; display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-window {
  background: #fff; border-radius: 12px; min-width: 320px; padding: 2em 2.5em 2em;
  box-shadow: 0 8px 32px 0 #12325433;
  display: flex; flex-direction: column; align-items: stretch;
}
.modal-window h4 { margin: 0 0 1.2em 0; }
.modal-window form { display: flex; flex-direction: column; gap: 1.1em; }
.modal-window input, .modal-window textarea, .modal-window select {
  padding: 0.6em 1.1em; font-size: 1.08em; border-radius: 8px; border: 1.3px solid #d1d8e0;
}
.modal-window textarea { resize: vertical; min-height: 50px; }
.modal-btns { display: flex; gap: 1.2em; justify-content: flex-end; margin-top: 1em;}
.modal-btns button { border-radius: 7px; font-size: 1em; padding: 0.48em 1.35em; border: none; cursor: pointer; }
.modal-btns button:first-child { background: #2186eb; color: #fff; }
.modal-btns button:last-child { background: #ececec; }
</style>
