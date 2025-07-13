const Product = require('../models/Product')

// Умная функция: парсит строку в объект, если это JSON
function tryParseJSON(val) {
  if (typeof val === 'object' && val !== null) return val
  try {
    return JSON.parse(val)
  } catch {
    return val
  }
}

// Получить все товары (с фильтром по категории)
exports.getAll = async (req, res) => {
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  const products = await Product.find(filter).populate('category')
  res.json(products)
}

// Создать товар с поддержкой картинок и мультиязычности
exports.create = async (req, res) => {
  try {
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)
    let { title, price, category, description, weight } = req.body

    // Всегда парсим title/description (они могут быть строкой, если шли через FormData)
    title = tryParseJSON(title)
    description = tryParseJSON(description)
    console.log('PARSED TITLE:', title)
    console.log('PARSED DESCRIPTION:', description)

    const image = req.file ? '/uploads/' + req.file.filename : undefined

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Укажите все обязательные поля' })
    }

    const prod = new Product({ title, price, category, description, weight, image })
    await prod.save()
    res.json(prod)
  } catch (e) {
    console.error('Ошибка создания товара:', e)
    res.status(500).json({ message: 'Ошибка создания товара' })
  }
}

// Удалить товар
exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Товар удалён' })
}

// Обновить товар (картинка, мультиязычность)
exports.update = async (req, res) => {
  try {
    let update = req.body

    // Если новая картинка — добавляем
    if (req.file) {
      update.image = '/uploads/' + req.file.filename
    }

    // Всегда парсим title/description
    if (update.title) update.title = tryParseJSON(update.title)
    if (update.description) update.description = tryParseJSON(update.description)

    const prod = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
    res.json(prod)
  } catch (e) {
    console.error('Ошибка обновления товара:', e)
    res.status(500).json({ message: 'Ошибка обновления товара' })
  }
}
