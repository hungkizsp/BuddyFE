import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import PageShell from '../../../shared/components/ui/PageShell'

const initialForm = {
  email: '',
  password: '',
  rememberMe: false,
}

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/home', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        {/* Login Card */}
        <div className="w-full max-w-[460px] glass-simple rounded-3xl p-8 sm:p-10 border border-white/10">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-simple border border-white/10 mb-6">
              <span className="text-2xl">🦉</span>
              <span className="font-grotesk text-sm font-bold uppercase tracking-wider text-neon">
                BuddyEnglish
              </span>
            </div>
            <h1 className="font-grotesk text-3xl sm:text-4xl font-bold uppercase text-cream tracking-wide mb-2">
              Welcome back
            </h1>
            <p className="font-mono text-sm text-cream/50 uppercase">
              Log in to continue your adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <label className="block">
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="child@gmail.com"
                autoComplete="email"
                required
                className="
                  w-full px-4 py-3.5 rounded-xl
                  bg-white/[0.04] border border-white/10
                  text-cream font-nunito text-base
                  placeholder:text-cream/25
                  outline-none transition-all duration-200
                  focus:border-primary/50 focus:bg-white/[0.06] focus:shadow-glow
                "
              />
            </label>

            {/* Password */}
            <label className="block">
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="
                    w-full px-4 py-3.5 pr-12 rounded-xl
                    bg-white/[0.04] border border-white/10
                    text-cream font-nunito text-base
                    placeholder:text-cream/25
                    outline-none transition-all duration-200
                    focus:border-primary/50 focus:bg-white/[0.06] focus:shadow-glow
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70 transition-colors text-sm"
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-cream/50 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="font-mono text-xs uppercase">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-mono text-xs text-primary/70 hover:text-primary uppercase transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-4 rounded-xl
                bg-gradient-to-r from-blue-600 to-purple-600
                text-white font-grotesk text-base font-bold uppercase tracking-wider
                shadow-glow
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Logging in...
                </span>
              ) : 'Login'}
            </button>

            {/* Register link */}
            <p className="text-center font-mono text-sm text-cream/40">
              New to BuddyEnglish?{' '}
              <Link
                to="/register"
                className="text-primary font-bold hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PageShell>
  )
}

export default LoginPage
