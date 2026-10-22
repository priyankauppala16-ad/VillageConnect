
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  BriefcaseBusiness,
  IndianRupee,
  Search,
  RefreshCw,
  LogOut,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Phone,
  Sprout,
  Wallet,
} from 'lucide-react'

const API = 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('token')

const getErrorMessage = (data, fallback) =>
  data?.message || data?.error || fallback

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState('')
  const [amountInputs, setAmountInputs] = useState({})
  const [savingAmountJob, setSavingAmountJob] = useState(null)
  const [savingPaymentJob, setSavingPaymentJob] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [workerForm, setWorkerForm] = useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    password: '',
  })
  const [creatingWorker, setCreatingWorker] = useState(false)

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    }),
    []
  )

  const showError = (message) => {
    setError(message)
    setSuccess('')
  }

  const showSuccess = (message) => {
    setSuccess(message)
    setError('')
  }

  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setError('')

    try {
      const meResponse = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const meData = await meResponse.json().catch(() => ({}))

      if (!meResponse.ok) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }

      const currentUser = meData.user || meData.data?.user || meData

      if (currentUser.role !== 'admin') {
        navigate('/login')
        return
      }

      const [jobsResponse, workersResponse] = await Promise.all([
        fetch(`${API}/jobs/admin/all`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API}/jobs/admin/workers`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ])

      const jobsData = await jobsResponse.json().catch(() => ({}))
      const workersData = await workersResponse.json().catch(() => ({}))

      if (!jobsResponse.ok) {
        throw new Error(getErrorMessage(jobsData, 'Failed to load jobs'))
      }

      if (!workersResponse.ok) {
        throw new Error(getErrorMessage(workersData, 'Failed to load workers'))
      }

      const jobsList = Array.isArray(jobsData)
        ? jobsData
        : jobsData.jobs || jobsData.data?.jobs || jobsData.data || []

      const workersList = Array.isArray(workersData)
        ? workersData
        : workersData.workers ||
          workersData.data?.workers ||
          workersData.data ||
          []

      setJobs(jobsList)
      setWorkers(workersList)

      setAmountInputs((previous) => {
        const next = { ...previous }
        jobsList.forEach((job) => {
          next[job._id] = job.estimatedAmount ?? 0
        })
        return next
      })
    } catch (err) {
      showError(err.message || 'Unable to load dashboard')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!getToken()) {
      navigate('/login')
      return
    }
    loadDashboard()
  }, [loadDashboard, navigate])

  const handleWorkerInput = (event) => {
    const { name, value } = event.target
    setWorkerForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleCreateWorker = async (event) => {
    event.preventDefault()

    const { name, phone, email, village, password } = workerForm
    if (!name.trim() || !phone.trim() || !village.trim() || !password) {
      showError('Please fill name, phone, village and password')
      return
    }

    setCreatingWorker(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/auth/create-worker`, {
        method: 'POST',
        headers: { ...authHeaders, Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          village: village.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Failed to create worker'))
      }

      showSuccess(data.message || 'Worker account created successfully')
      setWorkerForm({
        name: '',
        phone: '',
        email: '',
        village: '',
        password: '',
      })
      await loadDashboard(false)
    } catch (err) {
      showError(err.message || 'Failed to create worker')
    } finally {
      setCreatingWorker(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboard(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleAssignWorker = async () => {
    if (!selectedJob || !selectedWorker) {
      showError('Please select a worker first')
      return
    }

    setAssigning(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${API}/jobs/admin/${selectedJob._id}/assign`,
        {
          method: 'PATCH',
          headers: { ...authHeaders, Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ workerId: selectedWorker }),
        }
      )

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(getErrorMessage(data, 'Failed to assign worker'))
      }

      showSuccess(data.message || 'Worker assigned successfully')
      setSelectedJob(null)
      setSelectedWorker('')
      await loadDashboard(false)
    } catch (err) {
      showError(err.message || 'Failed to assign worker')
    } finally {
      setAssigning(false)
    }
  }

  const handleSaveAmount = async (job) => {
    const amount = Number(amountInputs[job._id])

    if (
      amountInputs[job._id] === '' ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      showError('Please enter a valid amount')
      return
    }

    setSavingAmountJob(job._id)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/jobs/admin/${job._id}/amount`, {
        method: 'PATCH',
        headers: { ...authHeaders, Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ estimatedAmount: amount }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Failed to save estimated amount')
        )
      }

      showSuccess(data.message || 'Estimated amount saved successfully')
      await loadDashboard(false)
    } catch (err) {
      showError(err.message || 'Failed to save estimated amount')
    } finally {
      setSavingAmountJob(null)
    }
  }

  const handlePaymentStatus = async (job, paymentStatus) => {
    if (Number(job.estimatedAmount) <= 0) {
      showError('Please set the estimated amount first')
      return
    }

    if (job.paymentStatus === paymentStatus) return

    setSavingPaymentJob(job._id)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/jobs/admin/${job._id}/payment`, {
        method: 'PATCH',
        headers: { ...authHeaders, Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ paymentStatus }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Failed to update payment status')
        )
      }

      showSuccess(
        data.message || `Payment status changed to ${paymentStatus}`
      )
      await loadDashboard(false)
    } catch (err) {
      showError(err.message || 'Failed to update payment status')
    } finally {
      setSavingPaymentJob(null)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase().trim()
    if (!searchText) return true

    const farmerName =
      typeof job.farmer === 'object' ? job.farmer?.name || '' : ''
    const workerName =
      typeof job.worker === 'object' ? job.worker?.name || '' : ''

    const searchableText = [
      job.workType,
      job.title,
      job.jobTitle,
      job.description,
      job.village,
      job.status,
      job.paymentStatus,
      farmerName,
      workerName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(searchText)
  })

  const totalJobs = jobs.length
  const pendingJobs = jobs.filter((job) => job.status === 'pending').length
  const completedJobs = jobs.filter((job) => job.status === 'completed').length

  const totalEstimatedAmount = jobs.reduce(
    (sum, job) => sum + (Number(job.estimatedAmount) || 0),
    0
  )

  const pendingPayments = jobs.filter(
    (job) => Number(job.estimatedAmount) > 0 && job.paymentStatus !== 'paid'
  ).length

  const formatMoney = (amount) =>
    `₹${(Number(amount) || 0).toLocaleString('en-IN')}`

  const formatStatus = (status) => {
    if (!status) return 'Pending'
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const getStatusClass = (status) => {
    const value = String(status || 'pending').toLowerCase()

    if (value === 'completed' || value === 'paid') {
      return 'bg-green-100 text-green-700'
    }
    if (value === 'in-progress' || value === 'in_progress' || value === 'assigned') {
      return 'bg-blue-100 text-blue-700'
    }
    if (value === 'cancelled' || value === 'rejected') {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-amber-100 text-amber-700'
  }

  const getPersonName = (person) => {
    if (!person) return 'Not assigned'
    if (typeof person === 'string') return 'Assigned'
    return person.name || 'Not assigned'
  }

  const getFarmerName = (job) => getPersonName(job.farmer)
  const getWorkerName = (job) => getPersonName(job.worker)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">VillageConnect Admin</h1>
              <p className="text-green-100 text-sm">Manage jobs, workers and payments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg bg-white/15 hover:bg-white/25 px-3 py-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-3 py-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError('')} aria-label="Dismiss error">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="flex-1">{success}</p>
            <button onClick={() => setSuccess('')} aria-label="Dismiss success message">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
          <StatCard title="Total Jobs" value={totalJobs} icon={<BriefcaseBusiness className="w-6 h-6" />} color="bg-blue-100 text-blue-700" />
          <StatCard title="Pending Jobs" value={pendingJobs} icon={<Clock className="w-6 h-6" />} color="bg-amber-100 text-amber-700" />
          <StatCard title="Completed Jobs" value={completedJobs} icon={<CheckCircle className="w-6 h-6" />} color="bg-green-100 text-green-700" />
          <StatCard title="Workers" value={workers.length} icon={<Users className="w-6 h-6" />} color="bg-purple-100 text-purple-700" />
          <StatCard title="Estimated Total" value={formatMoney(totalEstimatedAmount)} icon={<IndianRupee className="w-6 h-6" />} color="bg-emerald-100 text-emerald-700" />
        </section>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Wallet className="w-6 h-6 text-amber-700 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-900">Payment overview</h2>
              <p className="text-sm text-amber-800 mt-1">
                {pendingPayments} job(s) have an estimated amount but are not marked as paid.
                Updating a job to Paid records its payment status; it does not process a bank transfer.
              </p>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-7">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Create Worker Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a worker login. Only an authenticated admin can use this form.
            </p>
          </div>

          <form onSubmit={handleCreateWorker} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="worker-name" className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                <input id="worker-name" name="name" value={workerForm.name} onChange={handleWorkerInput} required autoComplete="name" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Worker name" />
              </div>
              <div>
                <label htmlFor="worker-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
                <input id="worker-phone" name="phone" type="tel" value={workerForm.phone} onChange={handleWorkerInput} required autoComplete="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Phone number" />
              </div>
              <div>
                <label htmlFor="worker-email" className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input id="worker-email" name="email" type="email" value={workerForm.email} onChange={handleWorkerInput} autoComplete="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="worker@example.com" />
              </div>
              <div>
                <label htmlFor="worker-village" className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
                <input id="worker-village" name="village" value={workerForm.village} onChange={handleWorkerInput} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Village name" />
              </div>
              <div>
                <label htmlFor="worker-password" className="block text-sm font-medium text-gray-700 mb-1">Temporary password *</label>
                <input id="worker-password" name="password" type="password" value={workerForm.password} onChange={handleWorkerInput} required minLength={6} autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="At least 6 characters" />
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <button type="submit" disabled={creatingWorker} className="rounded-lg bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 font-semibold disabled:opacity-60">
                {creatingWorker ? 'Creating worker...' : 'Create Worker Account'}
              </button>
              <p className="text-xs text-gray-500">
                Share login details with the worker securely. Passwords are stored as hashes.
              </p>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">All Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">Assign workers, set estimates and update payment status</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search jobs, farmers, workers..."
                  className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-10 text-center">
              <BriefcaseBusiness className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700">No jobs found</h3>
              <p className="text-sm text-gray-500 mt-1">Try a different search or refresh the dashboard.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => {
                const amount = Number(job.estimatedAmount) || 0
                const isPaid = job.paymentStatus === 'paid'
                const isSavingPayment = savingPaymentJob === job._id
                const workName = job.workType || job.title || job.jobTitle || 'Untitled job'

                return (
                  <article key={job._id} className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{workName}</h3>
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusClass(job.status)}`}>
                            {formatStatus(job.status)}
                          </span>
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusClass(job.paymentStatus)}`}>
                            Payment: {formatStatus(job.paymentStatus)}
                          </span>
                        </div>

                        {job.description && (
                          <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400 shrink-0" />
                            Farmer: {getFarmerName(job)}
                          </p>
                          <p className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-gray-400 shrink-0" />
                            Worker: {getWorkerName(job)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            Village: {job.village || 'Not specified'}
                          </p>
                          {job.farmer?.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                              Farmer phone: {job.farmer.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full lg:w-80 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <label htmlFor={`amount-${job._id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                          Estimated job amount (₹)
                        </label>
                        <div className="flex gap-2">
                          <input
                            id={`amount-${job._id}`}
                            type="number"
                            min="0"
                            step="1"
                            value={amountInputs[job._id] ?? amount}
                            onChange={(event) => setAmountInputs((previous) => ({
                              ...previous,
                              [job._id]: event.target.value,
                            }))}
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount"
                          />
                          <button
                            onClick={() => handleSaveAmount(job)}
                            disabled={savingAmountJob === job._id}
                            className="rounded-lg bg-green-700 hover:bg-green-800 text-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
                          >
                            {savingAmountJob === job._id ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Current estimate: {formatMoney(amount)}</p>

                        <div className="border-t border-gray-200 mt-4 pt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Payment status</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePaymentStatus(job, 'pending')}
                              disabled={amount <= 0 || isSavingPayment || job.paymentStatus === 'pending'}
                              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold border disabled:cursor-not-allowed disabled:opacity-50 ${!isPaid ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-amber-50'}`}
                            >
                              {isSavingPayment ? 'Updating...' : 'Pending'}
                            </button>
                            <button
                              onClick={() => handlePaymentStatus(job, 'paid')}
                              disabled={amount <= 0 || isSavingPayment || isPaid}
                              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold border disabled:cursor-not-allowed disabled:opacity-50 ${isPaid ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-green-50'}`}
                            >
                              {isSavingPayment ? 'Updating...' : 'Paid'}
                            </button>
                          </div>
                          {amount <= 0 && (
                            <p className="text-xs text-amber-700 mt-2">Save an estimated amount above before updating payment status.</p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedJob(job)
                            setSelectedWorker(typeof job.worker === 'object' ? job.worker?._id || '' : job.worker || '')
                          }}
                          className="mt-4 w-full rounded-lg border border-green-700 text-green-700 hover:bg-green-50 px-3 py-2 text-sm font-semibold"
                        >
                          Assign / Change Worker
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !assigning) {
              setSelectedJob(null)
              setSelectedWorker('')
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Assign Worker</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedJob.workType || selectedJob.title || selectedJob.jobTitle || 'Selected job'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedJob(null)
                  setSelectedWorker('')
                }}
                disabled={assigning}
                className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <label htmlFor="worker-select" className="block text-sm font-semibold text-gray-700 mb-2">
                Select a worker
              </label>
              <select
                id="worker-select"
                value={selectedWorker}
                onChange={(event) => setSelectedWorker(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Choose worker...</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name}{worker.village ? ` — ${worker.village}` : ''}
                  </option>
                ))}
              </select>

              {workers.length === 0 && (
                <p className="text-sm text-amber-700 mt-2">No workers found. Register a worker account first.</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedJob(null)
                    setSelectedWorker('')
                  }}
                  disabled={assigning}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignWorker}
                  disabled={assigning || !selectedWorker}
                  className="flex-1 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
    </div>
  </div>
)

export default AdminDashboard