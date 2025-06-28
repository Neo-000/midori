const multer = require('multer')
const path = require('path')

// Настройка хранения файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// Загрузка изображения для товара
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Нет файла' })
  res.json({ imageUrl: `/uploads/${req.file.filename}` })
})

// ... (GET и POST уже реализованы выше)

// Редактировать товар
router.put('/:id', async (req, res) => {
  try {
    const { name, description, ingredients, weight, price, discount, image, category } = req.body
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, ingredients, weight, price, discount, image, category },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Товар не найден' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка редактирования товара' })
  }
})

// Удалить товар
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Товар не найден' })
    res.json({ message: 'Товар удалён' })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления товара' })
  }
})

module.exports = router
