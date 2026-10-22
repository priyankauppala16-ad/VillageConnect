import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Leaf,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react'

function Login() {
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save authentication data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect based on role
      if (data.user.role === 'farmer') {
        navigate('/farmer')
      } else if (data.user.role === 'worker') {
        navigate('/worker')
      } else if (data.user.role === 'admin') {
        navigate('/admin')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f2] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding */}
        <div className="hidden bg-[#123d2a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to home
            </Link>

            <div className="mt-20 max-w-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Leaf size={28} />
              </div>

              <h1 className="text-5xl font-semibold leading-tight">
                Welcome
                <span className="block text-lime-300">
                  back.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/70">
                Continue connecting with farmers, skilled workers
                and trusted local services.
              </p>
            </div>
          </div>

          <p className="text-sm text-white/40">
            © 2026 VillageConnect
          </p>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">

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
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Sign in to your account
              </h2>

              <p className="mt-2 text-slate-500">
                Enter your details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone number
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-[#287044] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-[#3d8b5f] focus:ring-2 focus:ring-[#3d8b5f]/10"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123d2a] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0d2f20] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#287044] hover:underline"
              >
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login