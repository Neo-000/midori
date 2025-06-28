require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/categories')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads')) // для отдачи картинок

// маршруты
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// подключаемся к MongoDB и запускаем сервер
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
  })
