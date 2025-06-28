const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ingredients: String,
  weight: Number,
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // если есть скидка, иначе 0
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
})

module.exports = mongoose.model('Product', productSchema)
