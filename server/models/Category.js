const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // Можно добавить иконку, описание и т.д.
})

module.exports = mongoose.model('Category', CategorySchema)
