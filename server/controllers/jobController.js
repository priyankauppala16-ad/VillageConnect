
const Job = require('../models/Job')
const User = require('../models/User')

// CREATE NEW JOB - FARMER
const createJob = async (req, res) => {
  try {
    const { workType, acres, date, time, village, description } = req.body

    if (!workType || !acres || !date || !time || !village) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      })
    }

    const job = await Job.create({
      farmer: req.user.id,
      workType,
      acres,
      date,
      time,
      village,
      description,
    })

    return res.status(201).json({
      success: true,
      message: 'Work request created successfully',
      job,
    })
  } catch (error) {
    console.error('Create job error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while creating job',
    })
  }
}

// GET FARMER'S JOBS
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ farmer: req.user.id })
      .populate('worker', 'name phone village role')
      .sort({ createdAt: -1 })

    return res.json({ success: true, jobs })
  } catch (error) {
    console.error('Get my jobs error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
    })
  }
}

// GET ALL JOBS - ADMIN
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')
      .sort({ createdAt: -1 })

    return res.json({ success: true, jobs })
  } catch (error) {
    console.error('Get all jobs error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
    })
  }
}

// GET ALL WORKERS - ADMIN
const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password')
    return res.json({ success: true, workers })
  } catch (error) {
    console.error('Get workers error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching workers',
    })
  }
}

// ASSIGN WORKER - ADMIN
const assignWorker = async (req, res) => {
  try {
    const { workerId } = req.body

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'Worker is required',
      })
    }

    const worker = await User.findOne({
      _id: workerId,
      role: 'worker',
    })

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found',
      })
    }

    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    job.worker = worker._id
    job.status = 'assigned'
    await job.save()

    const updatedJob = await Job.findById(job._id)
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')

    return res.json({
      success: true,
      message: `${worker.name} assigned successfully`,
      job: updatedJob,
    })
  } catch (error) {
    console.error('Assign worker error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while assigning worker',
    })
  }
}

// GET WORKER'S ASSIGNED JOBS
const getWorkerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ worker: req.user.id })
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')
      .sort({ createdAt: -1 })

    return res.json({ success: true, jobs })
  } catch (error) {
    console.error('Get worker jobs error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
    })
  }
}

// UPDATE JOB STATUS - ASSIGNED WORKER
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['accepted', 'in-progress', 'completed']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job status',
      })
    }

    const job = await Job.findOne({
      _id: req.params.id,
      worker: req.user.id,
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Assigned job not found',
      })
    }

    const validTransitions = {
      assigned: ['accepted'],
      accepted: ['in-progress'],
      'in-progress': ['completed'],
      completed: [],
    }

    if (!(validTransitions[job.status] || []).includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${job.status} to ${status}`,
      })
    }

    job.status = status
    await job.save()

    const updatedJob = await Job.findById(job._id)
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')

    return res.json({
      success: true,
      message: `Job marked as ${status}`,
      job: updatedJob,
    })
  } catch (error) {
    console.error('Update job status error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while updating job status',
    })
  }
}

// UPDATE ESTIMATED AMOUNT - ADMIN
const updateJobAmount = async (req, res) => {
  try {
    const { estimatedAmount } = req.body

    if (
      estimatedAmount === undefined ||
      estimatedAmount === null ||
      estimatedAmount === '' ||
      !Number.isFinite(Number(estimatedAmount)) ||
      Number(estimatedAmount) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid amount',
      })
    }

    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    job.estimatedAmount = Number(estimatedAmount)
    job.paymentStatus = 'pending'
    await job.save()

    const updatedJob = await Job.findById(job._id)
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')

    return res.json({
      success: true,
      message: 'Estimated amount updated successfully',
      job: updatedJob,
    })
  } catch (error) {
    console.error('Update job amount error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while updating job amount',
    })
  }
}

// UPDATE PAYMENT STATUS - ADMIN
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body

    if (!['pending', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      })
    }

    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    if (Number(job.estimatedAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please set the estimated amount first',
      })
    }

    job.paymentStatus = paymentStatus
    await job.save()

    const updatedJob = await Job.findById(job._id)
      .populate('farmer', 'name phone village')
      .populate('worker', 'name phone village role')

    return res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      job: updatedJob,
    })
  } catch (error) {
    console.error('Update payment status error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error while updating payment status',
    })
  }
}

module.exports = {
  createJob,
  getMyJobs,
  getAllJobs,
  getWorkers,
  assignWorker,
  getWorkerJobs,
  updateJobStatus,
  updateJobAmount,
  updatePaymentStatus,
}