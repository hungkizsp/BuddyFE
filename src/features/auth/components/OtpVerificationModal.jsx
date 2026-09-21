import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function OtpVerificationModal({ isOpen, email, onClose }) {
  const verifyEmail = useAuthStore((s) => s.verifyEmail)
  const resendOtp = useAuthStore((s) => s.resendOtp)
  const isLoading = useAuthStore((s) => s.isLoading)
  const navigate = useNavigate()

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    try {
      await verifyEmail({ email, otp: otp.trim() })
      setSuccessMsg('Xác nhận email thành công! Đang chuyển hướng...')
      setTimeout(() => {
        onClose()
        navigate('/home', { replace: true })
      }, 1500)
    } catch (err) {
      setError(err.message || 'Mã OTP không đúng hoặc đã hết hạn.')
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccessMsg('')
    try {
      await resendOtp(email)
      setSuccessMsg('Đã gửi lại mã OTP mới!')
    } catch (err) {
      setError('Không thể gửi lại OTP. Vui lòng thử lại.')
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
          <span className="text-4xl mb-2 block">📩</span>
          <h2 className="font-grotesk text-2xl font-bold uppercase text-cream tracking-wide">
            Xác nhận địa chỉ Email
          </h2>
          <p className="font-mono text-xs text-cream/50 uppercase mt-1">
            Vui lòng nhập mã OTP 6 chữ số vừa gửi tới <span className="text-primary font-bold">{email}</span>
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

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <span className="font-mono text-xs text-cream/50 uppercase tracking-wider mb-2 block text-center">
              Mã xác thực OTP
            </span>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-cream font-mono text-center tracking-widest text-2xl outline-none focus:border-primary/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-grotesk text-sm font-bold uppercase tracking-wider shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Đang xác thực...' : 'Xác Nhận Email ✨'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              className="font-mono text-xs text-primary/80 hover:text-primary uppercase transition-colors"
            >
              Chưa nhận được mã? Gửi lại OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
