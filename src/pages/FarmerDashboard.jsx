
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Leaf,
  LogOut,
  MapPin,
  Plus,
  Sprout,
  Tractor,
  UserRound,
  Wheat,
  X,
  Droplets,
  Phone,
  IndianRupee,
  RefreshCw,
} from 'lucide-react'

function FarmerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    workType: '',
    acres: '',
    date: '',
    time: '',
    village: '',
    description: '',
  })

  const services = [
    {
      title: 'Pesticide Spraying',
      description: 'Find experienced spraying workers',
      icon: Sprout,
    },
    {
      title: 'Planting & Harvesting',
      description: 'Get reliable farm workers',
      icon: Wheat,
    },
    {
      title: 'Tractor Work',
      description: 'Book tractor & operator services',
      icon: Tractor,
    },
    {
      title: 'Irrigation',
      description: 'Find irrigation specialists',
      icon: Droplets,
    },
  ]

  const token = () => localStorage.getItem('token')

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const authToken = token()

      if (!authToken) {
        navigate('/login')
        return null
      }

      const response = await fetch(
        'http://localhost:5000/api/auth/me',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return null
      }

      setUser(data.user)

      setForm((prev) => ({
        ...prev,
        village: data.user.village || '',
      }))

      return data.user
    } catch (err) {
      console.error('Authentication error:', err)
      setError('Unable to verify your account. Please try again.')
      return null
    }
  }

  // Fetch farmer's jobs
  const fetchJobs = async () => {
    try {
      setJobsLoading(true)
      setError('')

      const authToken = token()

      if (!authToken) {
        navigate('/login')
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/jobs/my-jobs',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load jobs')
      }

      setJobs(data.jobs || [])
    } catch (err) {
      console.error('Jobs error:', err)
      setError(err.message || 'Unable to load your work requests.')
    } finally {
      setJobsLoading(false)
    }
  }

  // Initial loading
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      const currentUser = await fetchUser()

      if (currentUser) {
        await fetchJobs()
      }

      setLoading(false)
    }

    loadDashboard()
  }, [])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Open create-job modal
  const openCreateModal = (workType = '') => {
    setError('')
    setSuccess('')

    setForm((prev) => ({
      ...prev,
      workType,
      village: user?.village || prev.village || '',
    }))

    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    if (submitting) return

    setShowModal(false)
    setError('')
    setSuccess('')
  }

  // Form change
  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Create job
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (
      !form.workType ||
      !form.acres ||
      !form.date ||
      !form.time ||
      !form.village
    ) {
      setError('Please fill all required fields.')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(
        'http://localhost:5000/api/jobs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({
            workType: form.workType,
            acres: Number(form.acres),
            date: form.date,
            time: form.time,
            village: form.village,
            description: form.description,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to create work request'
        )
      }

      setSuccess('Work request created successfully! 🚜')

      setForm({
        workType: '',
        acres: '',
        date: '',
        time: '',
        village: user?.village || '',
        description: '',
      })

      await fetchJobs()

      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
      }, 1200)
    } catch (err) {
      console.error('Create job error:', err)
      setError(err.message || 'Unable to create work request.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fbf7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'Farmer'

  // Dashboard statistics
  const activeJobs = jobs.filter((job) =>
    ['pending', 'assigned', 'accepted', 'in-progress'].includes(
      job.status
    )
  ).length

  const completedJobs = jobs.filter(
    (job) => job.status === 'completed'
  ).length

  const workersHired = jobs.filter((job) => job.worker).length

  const totalSpending = jobs.reduce(
    (total, job) => total + (Number(job.estimatedAmount) || 0),
    0
  )

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700'

      case 'assigned':
        return 'bg-yellow-50 text-yellow-700'

      case 'accepted':
        return 'bg-purple-50 text-purple-700'

      case 'in-progress':
        return 'bg-green-50 text-green-700'

      case 'completed':
        return 'bg-emerald-50 text-emerald-700'

      case 'cancelled':
        return 'bg-red-50 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Pending'

    return status
      .split('-')
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ')
  }

  const getPaymentStyle = (status) => {
    if (status === 'paid') {
      return 'bg-emerald-50 text-emerald-700'
    }

    return 'bg-orange-50 text-orange-700'
  }

  const formatPaymentStatus = (status) => {
    if (!status) return 'Not set'

    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Date formatting
  const formatDate = (date) => {
    if (!date) return 'Date not set'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date not set'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Select icon based on work type
  const getJobIcon = (workType) => {
    if (workType === 'Tractor Work') return Tractor
    if (workType === 'Planting & Harvesting') return Wheat
    if (workType === 'Irrigation') return Droplets

    return Sprout
  }

  return (
    <div className="min-h-screen bg-[#f6fbf7]">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 min-h-[72px] flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-green-700"
          >
            <Leaf size={25} />
            VillageConnect
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative p-2.5 rounded-full">
              <Bell size={20} className="text-gray-600" />
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserRound size={20} className="text-green-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'Farmer'}
                </p>
                <p className="text-xs text-gray-500">Farmer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-green-700 font-medium text-sm mb-1">
              FARMER DASHBOARD
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Good morning, {firstName} 👋
            </h1>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin size={16} />
              <span>{user?.village || 'Your village'}</span>
            </div>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-green-100 transition"
          >
            <Plus size={20} />
            Post a new job
          </button>
        </div>

        {/* Dashboard statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <Clock3 size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {activeJobs}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Current requests
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Completed</p>
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {completedJobs}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Jobs completed
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Workers Hired</p>
              <UserRound size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              {workersHired}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Jobs with assigned workers
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Estimated Spend</p>
              <CalendarDays size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">
              ₹{totalSpending.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Estimated total for your jobs
            </p>
          </div>
        </div>

        {/* Jobs and quick action */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5 gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your work requests
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Track your jobs, workers and payments
                </p>
              </div>

              <button
                onClick={fetchJobs}
                disabled={jobsLoading}
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:underline disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={jobsLoading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>

            {error && !showModal && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">
                {error}
                <button
                  onClick={fetchJobs}
                  className="ml-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            )}

            {jobsLoading ? (
              <div className="py-12 text-center">
                <div className="w-9 h-9 border-4 border-green-100 border-t-green-700 rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-3">
                  Loading your jobs...
                </p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                  <Sprout size={26} className="text-green-700" />
                </div>

                <h3 className="font-semibold text-gray-900 mt-4">
                  No work requests yet
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Create your first request and find the right worker.
                </p>

                <button
                  onClick={() => openCreateModal()}
                  className="mt-5 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Create work request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const Icon = getJobIcon(job.workType)
                  const worker = job.worker
                  const workerPhone = worker?.phone
                  const amount = Number(job.estimatedAmount) || 0

                  return (
                    <div
                      key={job._id}
                      className="border border-gray-100 rounded-xl p-4 hover:border-green-200 transition"
                    >
                      {/* Job title and status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                            <Icon size={21} className="text-green-700" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {job.workType}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {job.acres} acres · {formatDate(job.date)}
                              {job.time ? ` · ${job.time}` : ''}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                              <MapPin size={13} />
                              {job.village || user?.village || 'Village not set'}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(job.status)}`}
                        >
                          {formatStatus(job.status)}
                        </span>
                      </div>

                      {/* Job description */}
                      {job.description && (
                        <p className="text-sm text-gray-600 mt-3 leading-5">
                          {job.description}
                        </p>
                      )}

                      {/* Progress tracker */}
                      <div className="mt-5 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Job progress
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { status: 'assigned', label: 'Assigned' },
                            { status: 'accepted', label: 'Accepted' },
                            { status: 'in-progress', label: 'In progress' },
                            { status: 'completed', label: 'Completed' },
                          ].map((step, index) => {
                            const stages = [
                              'assigned',
                              'accepted',
                              'in-progress',
                              'completed',
                            ]
                            const currentIndex = stages.indexOf(job.status)
                            const isComplete =
                              currentIndex >= index && currentIndex !== -1
                            const isCancelled = job.status === 'cancelled'

                            return (
                              <div key={step.status} className="min-w-0">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    isComplete && !isCancelled
                                      ? 'bg-green-600'
                                      : 'bg-gray-200'
                                  }`}
                                />
                                <p
                                  className={`text-[10px] sm:text-xs mt-2 ${
                                    isComplete && !isCancelled
                                      ? 'text-green-700 font-semibold'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                            )
                          })}
                        </div>

                        {job.status === 'pending' && (
                          <p className="text-xs text-blue-700 mt-3">
                            Your request is waiting for a worker assignment.
                          </p>
                        )}

                        {job.status === 'cancelled' && (
                          <p className="text-xs text-red-600 mt-3">
                            This job has been cancelled.
                          </p>
                        )}
                      </div>

                      {/* Worker details */}
                      <div className="mt-4 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <UserRound size={19} className="text-blue-700" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">
                              Assigned worker
                            </p>

                            {worker ? (
                              <>
                                <p className="font-semibold text-gray-900 mt-1">
                                  {worker.name || 'Worker'}
                                </p>

                                {worker.village && (
                                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <MapPin size={13} />
                                    {worker.village}
                                  </p>
                                )}

                                {workerPhone && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {workerPhone}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-gray-600 mt-1">
                                Waiting for worker assignment
                              </p>
                            )}
                          </div>

                          {worker && workerPhone && (
                            <a
                              href={`tel:${String(workerPhone).replace(/[^\d+]/g, '')}`}
                              className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold shrink-0 transition"
                            >
                              <Phone size={15} />
                              <span className="hidden sm:inline">Call Worker</span>
                              <span className="sm:hidden">Call</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Amount and payment */}
                      <div className="grid sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-green-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <IndianRupee size={17} />
                            <span className="text-xs font-medium">
                              Estimated amount
                            </span>
                          </div>

                          <p className="text-xl font-bold text-gray-900 mt-2">
                            ₹{amount.toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-medium text-gray-500">
                            Payment status
                          </p>

                          <div className="mt-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStyle(job.paymentStatus)}`}
                            >
                              {formatPaymentStatus(job.paymentStatus)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            {job.paymentStatus === 'paid'
                              ? 'Payment marked as paid.'
                              : 'Please confirm payment with the operator when work is finished.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick action */}
          <div className="bg-green-700 rounded-2xl p-6 text-white">
            <p className="text-green-200 text-sm font-medium">
              QUICK ACTION
            </p>

            <h2 className="text-2xl font-bold mt-2">
              Need help with your farm?
            </h2>

            <p className="text-green-100 text-sm leading-6 mt-3">
              Tell us what work you need. Your local operator can help
              coordinate the right worker.
            </p>

            <button
              onClick={() => openCreateModal()}
              className="w-full mt-6 bg-white text-green-700 hover:bg-green-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus size={19} />
              Create work request
            </button>

            <div className="mt-5 pt-5 border-t border-green-600">
              <p className="text-xs text-green-200">
                Available support
              </p>
              <p className="font-semibold mt-1">8 AM – 8 PM</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              What work do you need?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a service to create a work request
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <button
                  key={service.title}
                  onClick={() => openCreateModal(service.title)}
                  className="text-left bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-300 hover:shadow-lg hover:shadow-green-100 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition">
                    <Icon size={23} className="text-green-700" />
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-4">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 leading-5">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-1 text-green-700 text-sm font-semibold mt-4">
                    Create request
                    <ChevronRight size={16} />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-gray-400">
            VillageConnect · Connecting villages, creating opportunities.
          </p>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </main>

      {/* Create job modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-green-700 text-sm font-semibold">
                  NEW WORK REQUEST
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Tell us what work you need
                </h2>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              >
                <X size={21} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work type *
                </label>

                <select
                  name="workType"
                  value={form.workType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-white"
                  required
                >
                  <option value="">Select work type</option>
                  <option value="Pesticide Spraying">Pesticide Spraying</option>
                  <option value="Planting & Harvesting">Planting & Harvesting</option>
                  <option value="Tractor Work">Tractor Work</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Land area (acres) *
                  </label>
                  <input
                    type="number"
                    name="acres"
                    value={form.acres}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    placeholder="e.g. 2"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    placeholder="Your village"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional details
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  placeholder="Tell us anything important about the work..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {form.description.length}/500
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={19} />
                      Create work request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard