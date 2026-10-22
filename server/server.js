const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VillageConnect Backend is running 🚜',
  })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully ✅')

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed ❌')
    console.error(error.message)
  })