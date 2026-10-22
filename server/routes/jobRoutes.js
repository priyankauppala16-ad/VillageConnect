
const express = require('express')
const router = express.Router()

const {
  createJob,
  getMyJobs,
  getAllJobs,
  getWorkers,
  assignWorker,
  getWorkerJobs,
  updateJobStatus,
  updateJobAmount,
  updatePaymentStatus,
} = require('../controllers/jobController')

const { protect, authorize } = require('../middleware/authMiddleware')

// FARMER ROUTES
router.post('/', protect, authorize('farmer'), createJob)
router.get('/my-jobs', protect, authorize('farmer'), getMyJobs)

// ADMIN ROUTES
router.get('/admin/all', protect, authorize('admin'), getAllJobs)
router.get('/admin/workers', protect, authorize('admin'), getWorkers)
router.patch('/admin/:id/assign', protect, authorize('admin'), assignWorker)
router.patch('/admin/:id/amount', protect, authorize('admin'), updateJobAmount)
router.patch('/admin/:id/payment', protect, authorize('admin'), updatePaymentStatus)

// WORKER ROUTES
router.get('/worker/my-jobs', protect, authorize('worker'), getWorkerJobs)
router.patch('/:id/status', protect, authorize('worker'), updateJobStatus)

module.exports = router