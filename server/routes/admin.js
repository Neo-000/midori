// server/routes/admin.js

const express = require('express')
const multer = require('multer')
const path = require('path')
const Category = require('../models/Category')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { adminAuth } = require('../middlewares/adminAuth')

const router = express.Router()

router.use((req, res, next) => {
  console.log('--- ADMIN ROUTE HIT ---', req.method, req.originalUrl)
  next()
})

// --- Настройка хранения файлов (multer) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
    cb(null, name)
  }
})
const upload = multer({ storage })

// --- Категории ---

// Добавить категорию
router.post('/categories', adminAuth, upload.single('image'), async (req, res) => {
  try {
    // !!! Парсим name если пришёл как строка (JSON)
    let name = req.body.name
    if (typeof name === 'string') {
      try { name = JSON.parse(name) } catch { /* просто оставим строкой */ }
    }
    const category = new Category({
      name,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    })
    await category.save()
    res.json(category)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Обновить категорию
router.put('/categories/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    let name = req.body.name
    if (typeof name === 'string') {
      try { name = JSON.parse(name) } catch {}
    }
    const update = { name }
    if (req.file) update.image = `/uploads/${req.file.filename}`

    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!cat) return res.status(404).json({ message: 'Категория не найдена' })
    res.json(cat)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Удалить категорию
router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Категория удалена' })
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// --- Товары ---

// Добавить товар
router.post('/products', adminAuth, upload.single('image'), async (req, res) => {
  try {
    // !!! Парсим title/description если пришли как строки
    let title = req.body.title
    let description = req.body.description
    if (typeof title === 'string') {
      try { title = JSON.parse(title) } catch {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description) } catch {}
    }

    const product = new Product({
      title,
      price: req.body.price,
      category: req.body.category,
      description,
      weight: req.body.weight,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    })
    await product.save()
    res.json(product)
  } catch (e) {
    console.error('Ошибка при добавлении товара:', e)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Обновить товар
router.put('/products/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    let title = req.body.title
    let description = req.body.description
    if (typeof title === 'string') {
      try { title = JSON.parse(title) } catch {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description) } catch {}
    }
    const update = {
      title,
      price: req.body.price,
      category: req.body.category,
      description,
      weight: req.body.weight,
    }
    if (req.file) update.image = `/uploads/${req.file.filename}`

    const prod = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!prod) return res.status(404).json({ message: 'Товар не найден' })
    res.json(prod)
  } catch (e) {
    console.error('Ошибка при обновлении товара:', e)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Удалить товар
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Товар удалён' })
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('products.product')
    res.json(orders)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// Обновить статус заказа
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json(order)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
