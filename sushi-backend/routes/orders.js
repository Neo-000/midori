const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

// Создать заказ
router.post('/', async (req, res) => {
  try {
    const { user, items, customerName, phone, address, totalPrice } = req.body
    const order = new Order({ user, items, customerName, phone, address, totalPrice })
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка создания заказа' })
  }
})

// Получить все заказы (для админа, с пагинацией)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user')
      .populate('items.product')
    const total = await Order.countDocuments()
    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения заказов' })
  }
})

// Получить заказы пользователя (история)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('items.product')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения заказов пользователя' })
  }
})

// Изменить статус заказа (например: новый → в работе → выполнен)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Заказ не найден' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления статуса заказа' })
  }
})

module.exports = router
