import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import PageShell from '../../../shared/components/ui/PageShell'

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-danger' }
  if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-accent' }
  if (score <= 3) return { level: 3, label: 'Good', color: 'bg-neon/70' }
  return { level: 4, label: 'Strong', color: 'bg-neon' }
}

function SignupPage() {
  const navigate = useNavigate()
  const signup = useAuthStore((state) => state.signup)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      navigate('/home', { replace: true })
    } catch (signupError) {
      setError(signupError.message)
    }
  }

  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        {/* Signup Card */}
        <div className="w-full max-w-[460px] glass-simple rounded-3xl p-8 sm:p-10 border border-white/10">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-simple border border-white/10 mb-6">
              <span className="text-2xl">🦉</span>
              <span className="font-grotesk text-sm font-bold uppercase tracking-wider text-neon">
                BollyEnglish
              </span>
            </div>
            <h1 className="font-grotesk text-3xl sm:text-4xl font-bold uppercase text-cream tracking-wide mb-2">
              Create account
            </h1>
            <p className="font-mono text-sm text-cream/50 uppercase">
              Begin your English adventure today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <label className="block">
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block">
                Username
              </span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                required
                minLength={3}
                maxLength={50}
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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

              {/* Password strength */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`font-mono text-[11px] text-right mt-1 ${
                    strength.level <= 1 ? 'text-danger' :
                    strength.level <= 2 ? 'text-accent' : 'text-neon'
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </label>

            {/* Confirm Password */}
            <label className="block">
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block">
                Confirm password
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                minLength={6}
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
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>

            {/* Login link */}
            <p className="text-center font-mono text-sm text-cream/40">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-bold hover:text-primary/80 transition-colors"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PageShell>
  )
}

export default SignupPage
