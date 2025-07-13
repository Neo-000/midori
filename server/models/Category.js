const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  name: {
    ru: { type: String, required: true },
    rs: { type: String, required: true }
  },

})

module.exports = mongoose.model('Category', CategorySchema)
