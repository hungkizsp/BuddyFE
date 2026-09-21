import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const forgotPassword = useAuthStore((s) => s.forgotPassword)
  const resetPassword = useAuthStore((s) => s.resetPassword)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [step, setStep] = useState(1) // 1: Enter email, 2: Enter OTP & new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    try {
      await forgotPassword({ email: email.trim() })
      setSuccessMsg('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Không tìm thấy tài khoản với email này.')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không trùng khớp.')
      return
    }

    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      })
      setSuccessMsg('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.')
      setTimeout(() => {
        onClose()
        setStep(1)
        setEmail('')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Mã OTP không đúng hoặc đã hết hạn.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-simple rounded-3xl p-6 sm:p-8 border border-white/10 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/40 hover:text-cream text-xl transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">🔑</span>
          <h2 className="font-grotesk text-2xl font-bold uppercase text-cream tracking-wide">
            {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
          </h2>
          <p className="font-mono text-xs text-cream/50 uppercase mt-1">
            {step === 1
              ? 'Nhập email để nhận mã OTP xác thực'
              : 'Nhập mã OTP từ email và mật khẩu mới của bé'}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-neon/10 border border-neon/20 text-neon text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block">
                Địa chỉ Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@gmail.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-cream font-nunito text-base outline-none focus:border-primary/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-grotesk text-sm font-bold uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi mã OTP 📩'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-1 block">
                Mã OTP (6 chữ số)
              </span>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-cream font-mono text-center tracking-widest text-lg outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-1 block">
                Mật khẩu mới
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-cream font-nunito text-sm outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-1 block">
                Xác nhận mật khẩu mới
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-cream font-nunito text-sm outline-none focus:border-primary/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-grotesk text-sm font-bold uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Đang đặt lại...' : 'Đổi mật khẩu ✨'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
