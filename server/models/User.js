
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      set: (value) => {
        if (typeof value !== 'string' || value.trim() === '') {
          return undefined
        }
        return value.trim().toLowerCase()
      },
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['farmer', 'worker', 'admin'],
      default: 'farmer',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)