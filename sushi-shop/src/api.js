import { API_BASE_URL } from './constants'

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
      // 'Authorization': `Bearer ${authStore.token}`, // если нужен токен
    },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error('Ошибка оформления заказа')
  return await res.json()
}

// ---- АДМИНКА ----

// Добавить категорию с картинкой
export async function addCategoryApi(name, file, token) {
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
  if (!res.ok) throw new Error('Ошибка добавления категории')
  return await res.json()
}

// Добавить товар с картинкой
export async function addProductApi({ title, price, category, file, description }, token) {
  const form = new FormData()
  form.append('title', title)
  form.append('price', price)
  form.append('category', category)
  if (description) form.append('description', description)
  if (file) form.append('image', file)

  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  })
  if (!res.ok) throw new Error('Ошибка добавления товара')
  return await res.json()
}
