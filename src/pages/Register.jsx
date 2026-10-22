import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
} from 'lucide-react'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    password: '',
    role: 'farmer',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setMessage('Registration successful! 🎉')

      setFormData({
        name: '',
        phone: '',
        email: '',
        village: '',
        password: '',
        role: 'farmer',
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f2] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding section */}
        <div className="hidden bg-[#123d2a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to home
            </Link>

            <div className="mt-16 max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Leaf size={28} />
              </div>

              <h1 className="text-5xl font-semibold leading-tight">
                Join your local
                <span className="block text-lime-300">
                  village network.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/70">
                Connect with farmers, skilled workers and trusted local
                services through VillageConnect.
              </p>
            </div>
          </div>

          <p className="text-sm text-white/40">
            © 2026 VillageConnect
          </p>
        </div>

        {/* Register section */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-xl">

            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-600"
              >
                <ArrowLeft size={18} />
                Back
              </Link>

              <div className="mt-6 flex items-center gap-2 font-semibold text-[#123d2a]">
                <Leaf size={22} />
                VillageConnect
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-[#3d8b5f]">
                CREATE ACCOUNT
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome to VillageConnect
              </h2>

              <p className="mt-2 text-slate-500">
                Create your account and get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                    />
                  </div>
                </div>

              </div>

              {/* Village */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Village
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Enter your village"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  I am a
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-[#3d8b5f]"
                >
                  <option value="farmer">Farmer / Customer</option>
                  <option value="worker">Skilled Worker</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                  />
                </div>
              </div>

              {/* Messages */}
              {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123d2a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0d2f20] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#287044] hover:underline"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Register