
const express = require('express')

const {
  registerUser,
  loginUser,
  createWorker,
} = require('../controllers/authController')

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware')

const User = require('../models/User')

const router = express.Router()

// Public registration — farmer accounts only
router.post('/register', registerUser)

// Public login
router.post('/login', loginUser)

// Admin-only worker creation
router.post(
  '/create-worker',
  protect,
  authorize('admin'),
  createWorker
)

// Get logged-in user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get user error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

module.exports = router