import { API_BASE_URL } from './constants'
import { useAuthStore } from './store/auth'

// Вспомогалка для токена
function getToken() {
  try {
    const authStore = useAuthStore()
    if (!authStore.token) throw new Error('Требуется авторизация')
    return authStore.token
  } catch {
    throw new Error('Требуется авторизация')
  }
}

// ---------- ПУБЛИЧНЫЕ АПИ ----------

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`)
  return await res.json()
}

export async function getProducts(categoryId) {
  let url = `${API_BASE_URL}/products`
  if (categoryId) url += '?category=' + categoryId
  const res = await fetch(url)
  return await res.json()
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error('Ошибка оформления заказа')
  return await res.json()
}

// ---------- ФУНКЦИЯ ДЛЯ СЕРИАЛИЗАЦИИ ----------
function toFormData(obj, file) {
  const form = new FormData()
  Object.keys(obj).forEach(key => {
    // ВСЕ объекты (например, title, description) сериализуем!
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      form.append(key, JSON.stringify(obj[key]))
    } else if (obj[key] !== undefined && obj[key] !== null) {
      form.append(key, obj[key])
    }
  })
  if (file) form.append('image', file)
  return form
}

// ---------- АДМИНКА: КАТЕГОРИИ ----------

export async function addCategoryApi(category, file = null) {
  const token = getToken()
  const form = toFormData(category, file)
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function updateCategoryApi(id, category, file = null) {
  const token = getToken()
  const form = toFormData(category, file)
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deleteCategoryApi(id) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// ---------- АДМИНКА: ТОВАРЫ ----------

export async function addProductApi(product, file = null) {
  const token = getToken()
  const form = toFormData(product, file)
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function updateProductApi(id, product, file = null) {
  const token = getToken()
  const form = toFormData(product, file)
  const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deleteProductApi(productId) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// ---------- АДМИНКА: ЗАКАЗЫ ----------

export async function getOrdersApi() {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

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
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// ---------- ЛИЧНЫЙ КАБИНЕТ: МОИ ЗАКАЗЫ ----------

export async function getMyOrdersApi() {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/orders/my`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// ---------- ЛИЧНЫЙ КАБИНЕТ: ОБНОВИТЬ ПРОФИЛЬ ----------

export async function updateProfileApi(profile) {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}
