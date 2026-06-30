import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './SignupPage.css'

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

  if (score <= 1) return { level: 1, label: 'Weak' }
  if (score <= 2) return { level: 2, label: 'Fair' }
  if (score <= 3) return { level: 3, label: 'Good' }
  return { level: 4, label: 'Strong' }
}

const strengthClass = ['', 'weak', 'fair', 'good', 'strong']

function SignupPage() {
  const navigate = useNavigate()
  const signup = useAuthStore((state) => state.signup)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

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
    <main className="signup-page">
      <section className="signup-hero" aria-label="BuddyEnglish welcome">
        <div className="brand-mark">BuddyEnglish</div>
        <div className="mascot-stage" aria-hidden="true">
          <img src="/favicon.svg" alt="" />
          <div className="mascot-bubble bubble-one">ABC</div>
          <div className="mascot-bubble bubble-two">Hi!</div>
          <div className="mascot-bubble bubble-three">★</div>
        </div>
        <div className="signup-copy">
          <p className="eyebrow">Start your journey</p>
          <h1>Begin your English adventure today!</h1>
          <p>
            Create an account and join thousands of kids learning English
            with their friendly AI buddy.
          </p>
        </div>
      </section>

      <section className="signup-panel" aria-label="Signup form">
        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="form-heading">
            <p className="eyebrow">Get started</p>
            <h2>Create account</h2>
          </div>

          <label className="field" htmlFor="signup-username">
            <span>Username</span>
            <input
              id="signup-username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
            />
          </label>

          <label className="field" htmlFor="signup-email">
            <span>Email</span>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="child@gmail.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field" htmlFor="signup-password">
            <span>Password</span>
            <input
              id="signup-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
              minLength={6}
            />
            {form.password && (
              <>
                <div className="password-strength">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`strength-bar${i <= strength.level ? ` active ${strengthClass[strength.level]}` : ''}`}
                    />
                  ))}
                </div>
                <p className={`strength-label ${strengthClass[strength.level]}`}>
                  {strength.label}
                </p>
              </>
            )}
          </label>

          <label className="field" htmlFor="signup-confirm-password">
            <span>Confirm password</span>
            <input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="signup-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="login-line">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default SignupPage
