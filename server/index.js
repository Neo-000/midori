require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const uploadRoutes = require('./routes/upload')


const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api/upload', uploadRoutes)


// Тестовый рут
app.get('/', (req, res) => {
  res.json({ message: 'Backend работает!' })
})

// Подключение к MongoDB и запуск сервера
const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  })
