const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:     { type: String, default: '' },
  phone:    { type: String, default: '' },    // <-- добавил телефон
  bonus:    { type: Number, default: 0 },     // <-- добавил бонусы
  role:     { type: String, enum: ['user', 'admin'], default: 'user' }
})

module.exports = mongoose.model('User', UserSchema)
