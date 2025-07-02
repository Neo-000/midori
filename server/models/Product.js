const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  weight: Number,
  isActive: { type: Boolean, default: true }
  // можно добавить isPopular, состав, калории и т.д.
})

module.exports = mongoose.model('Product', ProductSchema)
