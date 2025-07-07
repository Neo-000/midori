<template>
  <div class="categories-admin">
    <div class="cat-header">
      <span class="cat-title">Категории</span>
      <button class="add-btn" @click="showModal = true">
        Добавить категорию <span>+</span>
      </button>
    </div>
    <ul class="cat-list">
      <li v-for="cat in categories" :key="cat._id" class="cat-item">
        <span>{{ cat.name }}</span>
        <div class="cat-actions">
          <button @click="editCategory(cat)">✏️</button>
          <button @click="deleteCategory(cat)">🗑️</button>
        </div>
      </li>
    </ul>
    <!-- Модалка для добавления/редактирования -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-window">
        <h4>{{ editMode ? 'Редактировать' : 'Добавить' }} категорию</h4>
        <form @submit.prevent="saveCategory">
          <input v-model="modalCatName" placeholder="Название категории" required />
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
import { ref, onMounted } from 'vue'
import { getCategories, addCategoryApi, updateCategoryApi, deleteCategoryApi } from '../api'

const categories = ref([])
const showModal = ref(false)
const modalCatName = ref('')
const editMode = ref(false)
const editCatId = ref(null)

async function loadCategories() {
  categories.value = await getCategories()
}
onMounted(loadCategories)

function closeModal() {
  showModal.value = false
  modalCatName.value = ''
  editMode.value = false
  editCatId.value = null
}

function editCategory(cat) {
  editMode.value = true
  showModal.value = true
  modalCatName.value = cat.name
  editCatId.value = cat._id
}

async function saveCategory() {
  if (!modalCatName.value.trim()) return
  if (editMode.value) {
    await updateCategoryApi(editCatId.value, modalCatName.value)
  } else {
    await addCategoryApi(modalCatName.value)
  }
  closeModal()
  await loadCategories()
}

async function deleteCategory(cat) {
  if (confirm(`Удалить категорию "${cat.name}"?`)) {
    await deleteCategoryApi(cat._id)
    await loadCategories()
  }
}
</script>

<style scoped>
.categories-admin { max-width: 420px; }
.cat-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.4rem;
}
.cat-title { font-size: 1.2em; font-weight: 500; }
.add-btn {
  background: #3796f5; color: #fff; border-radius: 8px; border: none;
  padding: 0.45em 1.6em; font-size: 1.08em; cursor: pointer; font-weight: 500;
  display: flex; align-items: center; gap: 0.6em;
  transition: background .12s;
}
.add-btn span { font-size: 1.2em; }
.cat-list { list-style: none; margin: 0; padding: 0; }
.cat-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5em 1em; border-radius: 7px; background: #f8fafd;
  margin-bottom: 7px;
}
.cat-actions button {
  background: none; border: none; font-size: 1.15em; cursor: pointer;
  margin-left: 7px;
}
.modal-backdrop {
  position: fixed; inset: 0; background: #212d3a1a; display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-window {
  background: #fff; border-radius: 9px; min-width: 270px; padding: 2.2em 2.4em 1.7em;
  box-shadow: 0 8px 32px 0 #12325433;
  display: flex; flex-direction: column; align-items: stretch;
}
.modal-window h4 { margin: 0 0 1.4em 0; }
.modal-window form { display: flex; flex-direction: column; gap: 1.1em; }
.modal-window input { padding: 0.6em 1.1em; font-size: 1.08em; }
.modal-btns { display: flex; gap: 1.2em; justify-content: flex-end; }
.modal-btns button { border-radius: 7px; font-size: 1em; padding: 0.45em 1.3em; border: none; cursor: pointer; }
.modal-btns button:first-child { background: #2186eb; color: #fff; }
.modal-btns button:last-child { background: #ececec; }
</style>
