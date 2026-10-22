
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  Leaf,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Sprout,
  UserRound,
  Wallet,
} from 'lucide-react'

const API = 'http://localhost:5000/api'

function WorkerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingJob, setUpdatingJob] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const getToken = () => localStorage.getItem('token')

  const fetchUser = useCallback(async () => {
    const token = getToken()

    if (!token) {
      navigate('/login')
      return null
    }

    try {
      const response = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return null
      }

      if (data.user?.role !== 'worker') {
        setError('Worker account required. Please log in as a worker.')
        return null
      }

      setUser(data.user)
      return data.user
    } catch (err) {
      console.error(err)
      setError('Unable to connect to server. Please try again.')
      return null
    }
  }, [navigate])

  const fetchJobs = useCallback(async () => {
    const token = getToken()

    if (!token) {
      navigate('/login')
      return
    }

    const response = await fetch(`${API}/jobs/worker/my-jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Unable to load assigned jobs.')
    }

    setJobs(data.jobs || [])
  }, [navigate])

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      setLoading(true)
      const currentUser = await fetchUser()

      if (currentUser && mounted) {
        try {
          await fetchJobs()
        } catch (err) {
          if (mounted) setError(err.message)
        }
      }

      if (mounted) setLoading(false)
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [fetchUser, fetchJobs])

  const handleRefresh = async () => {
    setRefreshing(true)
    setError('')

    try {
      await fetchJobs()
    } catch (err) {
      setError(err.message || 'Unable to refresh jobs.')
    } finally {
      setRefreshing(false)
    }
  }

  const updateStatus = async (jobId, status) => {
    setUpdatingJob(jobId)
    setError('')
    setSuccess('')

    try {
      const token = getToken()
      const response = await fetch(`${API}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update job.')
      }

      setJobs((current) =>
        current.map((job) => job._id === jobId ? data.job : job)
      )
      setSuccess(data.message || 'Job status updated successfully.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to update job.')
    } finally {
      setUpdatingJob(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-50 text-yellow-700'
      case 'accepted':
        return 'bg-purple-50 text-purple-700'
      case 'in-progress':
        return 'bg-blue-50 text-blue-700'
      case 'completed':
        return 'bg-emerald-50 text-emerald-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatDate = (date) => {
    if (!date) return 'Date not specified'

    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return 'Date not specified'

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-IN')

  const activeJobs = useMemo(
    () => jobs.filter((job) =>
      ['assigned', 'accepted', 'in-progress'].includes(job.status)
    ).length,
    [jobs]
  )

  const completedJobs = useMemo(
    () => jobs.filter((job) => job.status === 'completed').length,
    [jobs]
  )

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return jobs.filter((job) => {
      const workName = job.workType || job.title || job.jobTitle || 'Farm work'
      const farmerName = job.farmer?.name || ''
      const village = job.village || job.farmer?.village || ''

      const matchesSearch = [
        workName,
        farmerName,
        village,
        job.description || '',
      ].some((value) => String(value).toLowerCase().includes(query))

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' &&
          ['assigned', 'accepted', 'in-progress'].includes(job.status)) ||
        (filter === 'completed' && job.status === 'completed')

      return matchesSearch && matchesFilter
    })
  }, [jobs, search, filter])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fbf7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-700 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading your jobs...</p>
        </div>
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'Worker'
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[#f6fbf7]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 min-h-20 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-green-700">
            <Leaf size={25} />
            <span>VillageConnect</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserRound size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Skilled Worker</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <p className="text-green-700 font-semibold text-sm">WORKER DASHBOARD</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
              {greeting}, {firstName}! 👋
            </h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin size={16} />
              <span>{user?.village || 'Your village'}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold w-fit">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            Worker account active
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="mb-5 bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Active Jobs</p>
              <Clock3 size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{activeJobs}</p>
            <p className="text-xs text-green-600 mt-1">Assigned / active</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Completed</p>
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{completedJobs}</p>
            <p className="text-xs text-gray-500 mt-1">Jobs completed</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <Sprout size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{jobs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Assigned to you</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your assigned jobs</h2>
              <p className="text-sm text-gray-500 mt-1">
                View assignments, contact farmers and update your work progress.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-green-700 border border-green-100 hover:bg-green-50 px-4 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="p-5 sm:p-6 border-b border-gray-100 space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by work, farmer or village..."
                className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: `All Jobs (${jobs.length})` },
                { value: 'active', label: `Active (${activeJobs})` },
                { value: 'completed', label: `Completed (${completedJobs})` },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                    filter === item.value
                      ? 'bg-green-700 border-green-700 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {filteredJobs.length === 0 ? (
              <div className="py-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                  <Sprout size={30} className="text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mt-5">
                  {jobs.length === 0 ? 'No jobs assigned yet' : 'No matching jobs'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {jobs.length === 0
                    ? 'New work assignments will appear here.'
                    : 'Try another search term or filter.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => {
                  const workName =
                    job.workType || job.title || job.jobTitle || 'Farm work'
                  const farmerPhone = job.farmer?.phone
                  const amount = Number(job.estimatedAmount || 0)
                  const paymentStatus = job.paymentStatus || 'pending'

                  return (
                    <article
                      key={job._id}
                      className="border border-gray-100 rounded-2xl p-5 hover:border-green-200 transition"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div className="flex gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                            <Sprout size={23} className="text-green-700" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-bold text-gray-900">{workName}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(job.status)}`}>
                                {formatStatus(job.status)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-2">
                              {job.acres} acres • {formatDate(job.date)} • {job.time || 'Time not specified'}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {job.village || job.farmer?.village || 'Village not specified'}
                              </span>
                              <span>
                                Farmer:{' '}
                                <strong className="text-gray-700">
                                  {job.farmer?.name || 'Farmer'}
                                </strong>
                              </span>
                            </div>

                            {farmerPhone && (
                              <a
                                href={`tel:${String(farmerPhone).replace(/[^\d+]/g, '')}`}
                                className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-green-700 hover:text-green-900"
                              >
                                <Phone size={16} />
                                Call Farmer: {farmerPhone}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-40">
                          {job.status === 'assigned' && (
                            <button
                              onClick={() => updateStatus(job._id, 'accepted')}
                              disabled={updatingJob === job._id}
                              className="w-full bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                            >
                              {updatingJob === job._id ? 'Updating...' : 'Accept Job'}
                            </button>
                          )}

                          {job.status === 'accepted' && (
                            <button
                              onClick={() => updateStatus(job._id, 'in-progress')}
                              disabled={updatingJob === job._id}
                              className="w-full bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                            >
                              {updatingJob === job._id ? 'Updating...' : 'Start Work'}
                            </button>
                          )}

                          {job.status === 'in-progress' && (
                            <button
                              onClick={() => updateStatus(job._id, 'completed')}
                              disabled={updatingJob === job._id}
                              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                            >
                              {updatingJob === job._id ? 'Updating...' : 'Mark Completed'}
                            </button>
                          )}

                          {job.status === 'completed' && (
                            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm px-3 py-3">
                              <CheckCircle2 size={18} />
                              Work Completed
                            </div>
                          )}
                        </div>
                      </div>

                      {job.description && (
                        <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">
                          {job.description}
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                          <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                            <Wallet size={17} />
                            Estimated Job Amount
                          </div>
                          <p className="text-2xl font-bold text-green-900 mt-1">
                            {amount > 0 ? `₹${formatAmount(amount)}` : 'Not set'}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Estimate only; not a bank transfer.
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                          <p className="text-sm text-gray-600 font-semibold">Payment Status</p>
                          <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                            paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            Payment status is managed by the admin.
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            VillageConnect • Connecting villages, creating opportunities.
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
    </div>
  )
}

export default WorkerDashboard