const mongoose = require('mongoose')

// Описываем схему (структуру) заказа
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  // Если пользователь авторизован — будет его id, если нет — поле пустое

  items: [ // Массив товаров в заказе
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // ID товара
      quantity: { type: Number, required: true } // Сколько штук
    }
  ],

  customerName: { type: String, required: true }, // Имя заказчика
  phone: { type: String, required: true },        // Телефон
  address: { type: String, required: true },      // Адрес доставки

  totalPrice: { type: Number, required: true },   // Общая сумма заказа

  status: { type: String, default: 'новый' },     // Статус заказа
  createdAt: { type: Date, default: Date.now }    // Когда создан
})

// Экспортируем модель Order, чтобы её можно было использовать в других файлах
module.exports = mongoose.model('Order', orderSchema)
