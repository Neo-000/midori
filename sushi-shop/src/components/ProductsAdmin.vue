<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCategories, getProducts, addProductApi, updateProductApi, deleteProductApi } from '../api'
import { STATIC_BASE_URL } from '../constants'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const categories = ref([])
const products = ref([])
const selectedCatId = ref('')
const showModal = ref(false)
const editMode = ref(false)
const editProductId = ref(null)

// Поля для мультиязычной формы
const modalTitleRu = ref('')
const modalTitleRs = ref('')
const modalPrice = ref('')
const modalWeight = ref('')
const modalDescRu = ref('')
const modalDescRs = ref('')
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

// Вот эта реактивная реакция на смену языка — чтобы UI обновлялся сразу
watch(locale, () => {
  // если API не зависит от языка, то можно не грузить, Vue обновит всё сам
  // если нужно перезагрузить продукты с сервера при смене языка, раскомментируй:
  // loadProducts()
})

// Хелперы для вывода текста на текущем языке
function getProductTitle(prod) {
  return prod.title?.[locale.value] || prod.title?.ru || prod.title || ''
}
function getProductDesc(prod) {
  return prod.description?.[locale.value] || prod.description?.ru || prod.description || ''
}

function closeModal() {
  showModal.value = false
  editMode.value = false
  editProductId.value = null
  modalTitleRu.value = ''
  modalTitleRs.value = ''
  modalPrice.value = ''
  modalWeight.value = ''
  modalDescRu.value = ''
  modalDescRs.value = ''
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
  modalTitleRu.value = prod.title?.ru || ''
  modalTitleRs.value = prod.title?.rs || ''
  modalPrice.value = prod.price
  modalWeight.value = prod.weight || ''
  modalDescRu.value = prod.description?.ru || ''
  modalDescRs.value = prod.description?.rs || ''
  modalCategory.value = prod.category?._id || prod.category || categories.value[0]?._id
}
async function saveProduct() {
  if (!modalTitleRu.value || !modalPrice.value || !modalCategory.value) return
  const data = {
    title: { ru: modalTitleRu.value, rs: modalTitleRs.value },
    price: modalPrice.value,
    weight: modalWeight.value,
    description: { ru: modalDescRu.value, rs: modalDescRs.value },
    category: modalCategory.value,
  }
  const file = modalFile.value

  if (editMode.value) {
    await updateProductApi(editProductId.value, data, file)
  } else {
    await addProductApi(data, file)
  }
  closeModal()
  await loadProducts()
}
async function deleteProduct(prod) {
  if (confirm(`${t('remove')} "${getProductTitle(prod)}"?`)) {
    await deleteProductApi(prod._id)
    await loadProducts()
  }
}
function getImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  if (!image.startsWith('/')) image = '/' + image
  return STATIC_BASE_URL + image
}
</script>

<template>
  <div class="products-admin">
    <div class="products-header">
      <div class="category-filter">
        <span>{{ t('choose_category') }}</span>
        <select v-model="selectedCatId" @change="loadProducts">
          <option value="">{{ t('all_categories') }}</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">
            {{ cat.name?.[locale.value] || cat.name?.ru || cat.name }}
          </option>
        </select>
      </div>
      <button class="add-product-btn" @click="showModal = true">
        {{ t('add_product') }} <span>+</span>
      </button>
    </div>
    <div class="products-list">
      <div v-for="prod in products" :key="prod._id" class="product-card">
        <img v-if="prod.image" :src="getImageUrl(prod.image)" class="prod-img" />
        <div class="prod-info">
          <div class="prod-title-row">
            <b>{{ getProductTitle(prod) }}</b>
            <span class="prod-weight">{{ prod.weight ? prod.weight + ' г' : '' }}</span>
          </div>
          <div class="prod-desc">{{ getProductDesc(prod) }}</div>
          <div class="prod-price">{{ prod.price }} RSD</div>
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
        <h4>{{ editMode ? t('edit_product_title') : t('add_product_title') }}</h4>
        <form @submit.prevent="saveProduct">
          <input v-model="modalTitleRu" :placeholder="t('title') + ' (RU)'" required />
          <input v-model="modalTitleRs" :placeholder="t('title') + ' (SR)'" required />
          <input v-model="modalPrice" :placeholder="t('price')" type="number" required />
          <input v-model="modalWeight" :placeholder="t('weight')" type="number" />
          <textarea v-model="modalDescRu" :placeholder="t('description') + ' (RU)'"></textarea>
          <textarea v-model="modalDescRs" :placeholder="t('description') + ' (SR)'"></textarea>
          <select v-model="modalCategory">
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name?.[locale.value] || cat.name?.ru || cat.name }}
            </option>
          </select>
          <input type="file" @change="onFileChange" />
          <div class="modal-btns">
            <button type="submit">{{ editMode ? t('save') : t('add') }}</button>
            <button type="button" @click="closeModal">{{ t('cancel') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

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
