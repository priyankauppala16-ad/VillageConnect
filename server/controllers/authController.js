
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER FARMER
const registerUser = async (req, res) => {
  try {
    const { name, phone, email, village, password } = req.body

    if (!name || !phone || !village || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      })
    }

    const existingUser = await User.findOne({ phone })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      phone,
      email,
      village,
      password: hashedPassword,
      role: 'farmer',
    })

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        village: user.village,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    })
  }
}

// CREATE WORKER (ADMIN ONLY ROUTE MUST PROTECT THIS)
const createWorker = async (req, res) => {
  try {
    const { name, phone, email, village, password } = req.body

    if (!name || !phone || !village || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      })
    }

    const existingUser = await User.findOne({ phone })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const worker = await User.create({
      name,
      phone,
      email,
      village,
      password: hashedPassword,
      role: 'worker',
    })

    return res.status(201).json({
      success: true,
      message: 'Worker account created successfully',
      user: {
        id: worker._id,
        name: worker.name,
        phone: worker.phone,
        email: worker.email,
        village: worker.village,
        role: worker.role,
      },
    })
  } catch (error) {
    console.error('Create worker error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Server error while creating worker',
    })
  }
}

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required',
      })
    }

    const user = await User.findOne({ phone })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password',
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables')

      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        village: user.village,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  createWorker,
}