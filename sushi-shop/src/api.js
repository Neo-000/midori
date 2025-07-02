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
