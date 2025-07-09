import { API_BASE_URL } from './constants'
import { useAuthStore } from './store/auth'

// Получить все категории
export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`)
  return await res.json()
}

// Получить все товары (опционально с фильтром по категории)
export async function getProducts(categoryId) {
  let url = `${API_BASE_URL}/products`
  if (categoryId) url += '?category=' + categoryId
  const res = await fetch(url)
  return await res.json()
}

// Оформить заказ
export async function createOrder(order) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error('Ошибка оформления заказа')
  return await res.json()
}

// --- Вспомогательная функция для получения токена ---
function getToken() {
  try {
    const authStore = useAuthStore()
    if (!authStore.token) throw new Error('Требуется авторизация')
    return authStore.token
  } catch (e) {
    throw new Error('Требуется авторизация')
  }
}

// ---- АДМИНКА ----

// Добавить категорию с картинкой (если будет поддержка картинок)
export async function addCategoryApi(name, file) {
  const token = getToken()
  const form = new FormData()
  form.append('name', name)
  if (file) form.append('image', file)

  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка добавления категории: ' + errText)
  }
  return await res.json()
}

// Обновить категорию по id
export async function updateCategoryApi(id, name) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name })
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка редактирования категории: ' + errText)
  }
  return await res.json()
}

// Удалить категорию по id
export async function deleteCategoryApi(id) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка удаления категории: ' + errText)
  }
  return await res.json()
}

// Добавить товар с картинкой
export async function addProductApi({ title, price, category, file, description, weight }) {
  const token = getToken()
  const form = new FormData()
  form.append('title', title)
  form.append('price', price)
  form.append('category', category)
  if (description) form.append('description', description)
  if (weight) form.append('weight', weight)
  if (file) form.append('image', file)

  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка добавления товара: ' + errText)
  }
  return await res.json()
}

// Редактировать товар
export async function updateProductApi(id, data) {
  const token = getToken()
  let body, headers
  if (data.file) {
    body = new FormData()
    body.append('title', data.title)
    body.append('price', data.price)
    body.append('category', data.category)
    if (data.weight) body.append('weight', data.weight)
    if (data.description) body.append('description', data.description)
    body.append('image', data.file)
    headers = { 'Authorization': `Bearer ${token}` }
  } else {
    body = JSON.stringify({
      title: data.title,
      price: data.price,
      category: data.category,
      weight: data.weight,
      description: data.description
    })
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers,
    body
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка обновления товара: ' + errText)
  }
  return await res.json()
}

// Удалить товар по id
export async function deleteProductApi(productId) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Ошибка удаления товара: ' + errText)
  }
  return await res.json()
}


export async function getOrdersApi() {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Ошибка получения заказов')
  return await res.json()
}

// Обновить статус заказа
export async function updateOrderStatusApi(orderId, status) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Ошибка обновления статуса')
  return await res.json()
}