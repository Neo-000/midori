const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: {
    ru: { type: String, required: true },
    rs: { type: String, required: true },
    // en: { type: String } //
  },
  description: {
    ru: { type: String, default: '' },
    rs: { type: String, default: '' },
    // en: { type: String, default: '' }
  },
  price: { type: Number, required: true },
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  weight: Number,
  isActive: { type: Boolean, default: true }
  // можно добавить isPopular, состав, калории и т.д.
})

module.exports = mongoose.model('Product', ProductSchema)
