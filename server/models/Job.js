const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    workType: {
      type: String,
      required: true,
      enum: [
        'Pesticide Spraying',
        'Planting & Harvesting',
        'Tractor Work',
        'Irrigation',
        'Other',
      ],
    },

    acres: {
      type: Number,
      required: true,
      min: 0.1,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'accepted',
        'in-progress',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    estimatedAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Job', jobSchema)