const Category = require('../models/Category')

exports.getAll = async (req, res) => {
  const cats = await Category.find()
  res.json(cats)
}

exports.create = async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ message: 'Укажите имя' })
  const exists = await Category.findOne({ name })
  if (exists) return res.status(400).json({ message: 'Такая категория уже есть' })
  const cat = new Category({ name })
  await cat.save()
  res.json(cat)
}

exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.json({ message: 'Категория удалена' })
}

exports.update = async (req, res) => {
  const { name } = req.body
  const cat = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true })
  res.json(cat)
}
