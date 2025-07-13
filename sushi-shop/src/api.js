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

// Получить все категории
export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`)
  return await res.json()
}

// Получить все товары (с фильтром по категории)
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error('Ошибка оформления заказа')
  return await res.json()
}

// ---------- АДМИНКА: КАТЕГОРИИ ----------

// Добавить категорию (мультиязычно, опционально с картинкой)
export async function addCategoryApi(category, file = null) {
  const token = getToken()
  if (!file) {
    // Без картинки — JSON
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(category)
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } else {
    // С картинкой — FormData
    const form = new FormData()
    form.append('name', JSON.stringify(category.name))
    if (file) form.append('image', file)
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  }
}

// Обновить категорию
export async function updateCategoryApi(id, category, file = null) {
  const token = getToken()
  if (!file) {
    // Без картинки
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(category)
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } else {
    // С картинкой
    const form = new FormData()
    form.append('name', JSON.stringify(category.name))
    if (file) form.append('image', file)
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  }
}

// Удалить категорию
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

// Добавить товар (мультиязычно, опционально с картинкой)
export async function addProductApi(product, file = null) {
  const token = getToken()
  if (!file) {
    // Без картинки — JSON
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } else {
    // С картинкой — FormData
    const form = new FormData()
    Object.keys(product).forEach(key => {
      if (typeof product[key] === 'object') {
        form.append(key, JSON.stringify(product[key]))
      } else if (product[key] !== undefined && product[key] !== null) {
        form.append(key, product[key])
      }
    })
    form.append('image', file)
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  }
}

// Обновить товар
export async function updateProductApi(id, product, file = null) {
  const token = getToken()
  if (!file) {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } else {
    const form = new FormData()
    Object.keys(product).forEach(key => {
      if (typeof product[key] === 'object') {
        form.append(key, JSON.stringify(product[key]))
      } else if (product[key] !== undefined && product[key] !== null) {
        form.append(key, product[key])
      }
    })
    form.append('image', file)
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  }
}

// Удалить товар
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
