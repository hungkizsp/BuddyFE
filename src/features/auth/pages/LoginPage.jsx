import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './LoginPage.css'

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
    <main className="login-page">
      <section className="login-hero" aria-label="BuddyEnglish welcome">
        <div className="brand-mark">BuddyEnglish</div>
        <div className="mascot-stage" aria-hidden="true">
          <img src="/favicon.svg" alt="" />
          <div className="mascot-bubble bubble-one">ABC</div>
          <div className="mascot-bubble bubble-two">Hi!</div>
        </div>
        <div className="welcome-copy">
          <p className="eyebrow">AI English buddy for kids</p>
          <h1>Ready for today&apos;s English adventure?</h1>
          <p>
            Learn new words, earn coins, and grow confidence with a friendly
            companion by your side.
          </p>
        </div>
      </section>

      <section className="login-panel" aria-label="Login form">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="form-heading">
            <p className="eyebrow">Welcome back</p>
            <h2>Log in</h2>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="child@gmail.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="form-row">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="register-line">
            New to BuddyEnglish? <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
