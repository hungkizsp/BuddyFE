import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function GoogleLoginButton() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      // Prompt for email in dev/demo mode if Google SDK is not attached, or call Google auth API
      const email = prompt('Nhập địa chỉ Google Email của bạn để đăng nhập nhanh:', 'googleuser@gmail.com')
      if (!email) return

      await loginWithGoogle({
        idToken: 'mock_google_id_token',
        email: email.trim(),
        name: email.split('@')[0],
      })
      navigate('/home', { replace: true })
    } catch (err) {
      alert(err.message || 'Đăng nhập bằng Google thất bại.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full py-3.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-cream font-grotesk text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
        />
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
        />
        <path
          fill="#FBBC05"
          d="M5.6 14.8c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.5C.7 9.9 0 10.9 0 12.6s.7 2.7 1.9 5.1l3.7-2.9z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
        />
      </svg>
      Đăng nhập với Google
    </button>
  )
}
