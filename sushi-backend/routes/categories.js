const express = require('express')
const router = express.Router()
const Category = require('../models/Category')

// ... (GET и POST уже реализованы выше)

// Редактировать категорию
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    )
    if (!category) return res.status(404).json({ message: 'Категория не найдена' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка редактирования категории' })
  }
})

// Удалить категорию
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Категория не найдена' })
    res.json({ message: 'Категория удалена' })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка удаления категории' })
  }
})

module.exports = router
