// server/routes/admin.js
const express = require('express')
const multer = require('multer')
const path = require('path')
const Category = require('../models/Category')
const Product = require('../models/Product')
const { adminAuth } = require('../middlewares/adminAuth') // твоя мидлварь

const router = express.Router()

// Настройка хранения файлов
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
router.post('/categories', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    })
    await category.save()
    res.json(category)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// --- Товары ---
router.post('/products', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      description: req.body.description || '',
    })
    await product.save()
    res.json(product)
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
