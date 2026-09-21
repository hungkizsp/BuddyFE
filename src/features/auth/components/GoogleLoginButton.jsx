import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function GoogleLoginButton() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)
  const navigate = useNavigate()
  const [isGisLoaded, setIsGisLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (window.google?.accounts?.oauth2) {
      setIsGisLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setIsGisLoaded(true)
    document.head.appendChild(script)
  }, [])

  const handleGoogleSignIn = () => {
    setIsLoading(true)

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '1058223932822-demo.apps.googleusercontent.com'

    if (!window.google?.accounts?.oauth2) {
      setIsLoading(false)
      alert('Đang tải thư viện Google Sign-In, vui lòng thử lại sau vài giây.')
      return
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.error) {
            setIsLoading(false)
            console.error('Google OAuth Error:', response)
            return
          }

          if (response.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
              })
              const userInfo = await res.json()

              if (userInfo.email) {
                await loginWithGoogle({
                  idToken: response.access_token,
                  email: userInfo.email,
                  name: userInfo.name || userInfo.email.split('@')[0],
                })
                navigate('/home', { replace: true })
              } else {
                throw new Error('Google không trả về địa chỉ email.')
              }
            } catch (err) {
              console.error('Google authentication failed:', err)
              alert(err.message || 'Đăng nhập với Google không thành công.')
            } finally {
              setIsLoading(false)
            }
          } else {
            setIsLoading(false)
          }
        },
      })

      client.requestAccessToken()
    } catch (err) {
      setIsLoading(false)
      console.error('Failed to init Google Token Client:', err)
      alert('Lỗi khởi tạo đăng nhập Google. Vui lòng thử lại.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full py-3.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-cream font-grotesk text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
    >
      {isLoading ? (
        <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : (
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
      )}
      {isLoading ? 'Đang kết nối Google...' : 'Đăng nhập với Google'}
    </button>
  )
}
