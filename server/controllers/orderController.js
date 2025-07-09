const Order = require('../models/Order')

// Получить все заказы (только для админа)
exports.getAll = async (req, res) => {
  try {
    console.log('= getAll ORDERS, user:', req.user); // <--- Логируем!
    const orders = await Order.find().populate('user').populate('products.product')
    res.json(orders)
  } catch (err) {
    console.error('ORDERS GETALL ERROR:', err); // <-- Логируем ошибку!
    res.status(500).json({ message: 'Ошибка на сервере: ' + err.message })
  }
}
// Получить свои заказы (для пользователя)
exports.getMy = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId }).populate('products.product')
  res.json(orders)
}

// Создать заказ (доступно всем)
exports.create = async (req, res) => {
  try {
    const { name, phone, address, comment, products, total } = req.body
    const order = new Order({
      user: req.user ? req.user.userId : null, // если пользователь залогинен
      name, phone, address, comment, products, total
    })
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Ошибка создания заказа' })
  }
}

// Обновить статус заказа (только для админа)
exports.updateStatus = async (req, res) => {
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  res.json(order)
}
