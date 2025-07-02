const Product = require('../models/Product')

exports.getAll = async (req, res) => {
  // ?category=... — фильтр по категории (можно по id)
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  const products = await Product.find(filter).populate('category')
  res.json(products)
}

exports.create = async (req, res) => {
  const { title, price, category, description, image, weight } = req.body
  if (!title || !price || !category) return res.status(400).json({ message: 'Укажите все обязательные поля' })
  const prod = new Product({ title, price, category, description, image, weight })
  await prod.save()
  res.json(prod)
}

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Товар удалён' })
}

exports.update = async (req, res) => {
  const update = req.body
  const prod = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
  res.json(prod)
}
