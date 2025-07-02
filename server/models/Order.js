const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // может быть null для гостя
  name: { type: String, required: true },   // имя клиента (если не авторизован)
  phone: { type: String, required: true },  // телефон для связи
  address: { type: String, required: true },// адрес доставки
  comment: String,
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, required: true },  // сумма заказа
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'canceled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
