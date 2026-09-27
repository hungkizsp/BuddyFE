import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import SharedBollyModel from '../../../../shared/components/BollyModel'

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
)

const NAV_LINKS = [
  { name: 'Giới thiệu', href: '#about' },
  { name: 'Thế giới', href: '#worlds' },
  { name: 'Dành cho phụ huynh', href: '#parents' },
  { name: 'FAQ', href: '#faq' }
]

function InteractiveBolly({ reaction }) {
  const group = useRef()
  const [isMobile, setIsMobile] = useState(false)
  const startTimeRef = useRef(0)
  const prevReactionRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    if (reaction !== prevReactionRef.current) {
      if (reaction) startTimeRef.current = t
      prevReactionRef.current = reaction
    }

    const floatY = Math.sin(t * 1.5) * 0.08
    let posY = -1.1 + floatY
    let rotX = 0, rotY = 0

    if (reaction === 'wave') {
      const el = t - startTimeRef.current
      rotY = Math.sin(el * 12) * 0.22
      posY += Math.abs(Math.sin(el * 12)) * 0.1
    } else if (reaction === 'nod') {
      const el = t - startTimeRef.current
      rotX = Math.sin(el * 12) * 0.14
    }

    if (reaction) {
      group.current.position.y = posY
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotY, 0.15)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotX, 0.15)
    } else {
      group.current.position.y = posY
      if (!isMobile) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.45, 0.1)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.25, 0.1)
      } else {
        group.current.rotation.y = Math.sin(t * 0.5) * 0.1
        group.current.rotation.x = 0
      }
    }
  })

  return (
    <group ref={group} position={[0, -1.1, 0]} scale={1.35}>
      <SharedBollyModel />
    </group>
  )
}

function BollyScene({ reaction }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 4.2], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={2.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#fff5e0" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#6060ff" />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <InteractiveBolly reaction={reaction} />
      </Suspense>
    </Canvas>
  )
}

function SocialIcons() {
  return (
    <>
      <a
        href="mailto:bollyenglish@fpt.edu.vn"
        className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-cream"
      >
        <MailIcon />
      </a>
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-cream"
      >
        <TwitterIcon />
      </a>
      <a
        href="https://github.com/dagowlol/Exe101_Project"
        target="_blank"
        rel="noopener noreferrer"
        className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-cream"
      >
        <GithubIcon />
      </a>
    </>
  )
}

export default function MeetBollyHero({ onLearnMore, currentUser }) {
  const [bubbleText, setBubbleText] = useState("Xin chào! Mình là Bolly — bạn đồng hành luyện nói tiếng Anh AI của bạn. Mình lắng nghe, ghi nhớ và cùng bạn tiến bộ mỗi ngày!")
  const [reaction, setReaction] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const triggerReaction = (text, type) => {
    setBubbleText(text)
    setReaction(type)
    setTimeout(() => setReaction(null), 1500)
  }

  const baseLinks = [
    { name: 'Giới thiệu', href: '#about' },
    { name: 'Thế giới', href: '#worlds' },
    { name: 'Dành cho phụ huynh', href: '#parents' },
    { name: 'FAQ', href: '#faq' }
  ]
  const navLinks = currentUser
    ? [...baseLinks, { name: 'Trang chủ', href: '/home', isRoute: true }]
    : [...baseLinks, { name: 'Đăng nhập', href: '/login', isRoute: true }, { name: 'Đăng ký', href: '/register', isRoute: true }]

  return (
    <section className="relative overflow-hidden min-h-screen rounded-b-[32px] bg-[#010828] z-10 video-darken">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
      />

      {/* 3D Bolly Canvas */}
      <div className="absolute inset-0 left-0 md:left-[35%] z-10 pointer-events-none md:pointer-events-auto opacity-70 md:opacity-100">
        <BollyScene reaction={reaction} />
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#010828]/80 backdrop-blur-md z-50 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[280px] max-w-[80vw] h-full liquid-glass border-l border-white/10 p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-grotesk font-bold text-neon uppercase text-base">Menu</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream hover:bg-white/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Đóng menu"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-grotesk text-base uppercase text-cream hover:text-neon transition-colors py-2"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-grotesk text-base uppercase text-cream hover:text-neon transition-colors py-2"
                    >
                      {link.name}
                    </a>
                  )
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex gap-4 justify-center">
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container — sits above video-darken overlay (z-index > 1) */}
      <div className="relative z-20 w-full max-w-[1831px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col min-h-screen justify-between pb-10">
        
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between pt-5 sm:pt-7">
          {/* Logo */}
          <Link to={currentUser ? "/home" : "/landing"} className="font-grotesk text-lg sm:text-xl uppercase text-cream tracking-widest text-glow hover:text-neon transition-colors duration-200">
            BollyEnglish
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="liquid-glass hidden lg:flex items-center gap-10 rounded-[28px] px-[52px] py-[24px]">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-grotesk text-[15px] uppercase text-cream hover:text-neon transition-colors duration-200 text-readable"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-grotesk text-[15px] uppercase text-cream hover:text-neon transition-colors duration-200 text-readable"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* Social Icons (Desktop) */}
          <div className="hidden lg:flex flex-col gap-3">
            <SocialIcons />
          </div>

          {/* Mobile Menu Hamburger (Mobile/Tablet) */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl liquid-glass text-cream flex items-center justify-center hover:text-neon transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu điều hướng"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── HERO CONTENT ── */}
        <div className="flex-1 flex flex-col justify-center py-8 sm:py-10">
          <div className="relative w-full max-w-[780px] lg:ml-32">
            <h1 className="font-grotesk text-[32px] xs:text-[40px] sm:text-[60px] md:text-[76px] lg:text-[96px] uppercase leading-[1.08] md:leading-[1] text-cream text-glow">
              Vượt qua giới hạn<br />
              lớp học truyền thống
            </h1>

            {/* Script overlay */}
            <span className="font-condiment text-[24px] xs:text-[30px] sm:text-[42px] md:text-[54px] text-neon -rotate-1 mix-blend-exclusion opacity-90 absolute right-2 sm:right-4 lg:right-[20px] bottom-[-18px] sm:bottom-[-20px] leading-none normal-case pointer-events-none text-glow">
              trò chuyện cùng Bolly
            </span>
          </div>

          {/* Sub-description */}
          <p className="font-mono text-[13px] sm:text-[15px] uppercase text-cream/80 max-w-[560px] mt-6 sm:mt-8 lg:ml-32 leading-relaxed text-readable">
            Bạn đồng hành luyện nói tiếng Anh tích hợp AI dành riêng cho trẻ em Việt Nam từ 4–12 tuổi. Bolly kết hợp nhận diện giọng nói thời gian thực, trí nhớ thích ứng và trí tuệ cảm xúc giúp bé tự tin luyện nói tiếng Anh tự nhiên — mọi lúc, mọi nơi, không sợ mắc lỗi.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 lg:ml-32">
            {currentUser ? (
              <Link to="/home" className="inline-block px-6 py-3.5 sm:px-10 sm:py-5 bg-gradient-to-r from-neon to-[#88ff44] text-[#010828] font-grotesk text-xs sm:text-base uppercase tracking-wider rounded-full hover:scale-105 transition-transform font-bold">
                Đến Trang Chủ
              </Link>
            ) : (
              <Link to="/register" className="inline-block px-6 py-3.5 sm:px-10 sm:py-5 bg-gradient-to-r from-neon to-[#88ff44] text-[#010828] font-grotesk text-xs sm:text-base uppercase tracking-wider rounded-full hover:scale-105 transition-transform font-bold">
                Trải nghiệm Bolly miễn phí
              </Link>
            )}
            <button onClick={onLearnMore} className="liquid-glass px-6 py-3.5 sm:px-10 sm:py-5 font-grotesk text-xs sm:text-base uppercase tracking-wider rounded-full text-cream hover:bg-white/10 transition-all text-readable">
              Tìm hiểu thêm
            </button>
          </div>

          {/* Social Icons (Mobile) */}
          <div className="flex lg:hidden gap-3 mt-8 justify-start">
            <SocialIcons />
          </div>
        </div>

        {/* ── SPEECH BUBBLE ── */}
        <div className="hidden sm:block absolute right-[4%] lg:right-[6%] top-[12%] lg:top-[18%] max-w-[240px] sm:max-w-[300px] liquid-glass rounded-2xl rounded-tr-none p-4 sm:p-5 z-30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-neon font-bold">Bolly trực tuyến</span>
          </div>
          <p className="font-mono text-[13px] text-cream leading-relaxed">{bubbleText}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => triggerReaction("Rất vui được gặp bạn! Hãy để mình chỉ cho bạn cách giúp các bé tự tin giao tiếp tiếng Anh nhé. Cứ trò chuyện với mình như một người bạn thân!", 'wave')}
              className="font-mono text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 text-cream/80 rounded-lg border border-white/10 transition-all"
            >
              👋 Vẫy tay
            </button>
            <button
              onClick={() => triggerReaction("Mình ghi nhớ tất cả những gì chúng ta đã cùng nhau luyện tập! Hôm qua chúng ta đã học về các loài động vật. Bạn đã sẵn sàng tiếp tục hôm nay chưa?", 'nod')}
              className="font-mono text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 text-[#6FFF00] rounded-lg border border-[#6FFF00]/20 transition-all"
            >
              😊 Mỉm cười
            </button>
          </div>
        </div>

        {/* ── BOTTOM STATS BAR ── */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-cream/50 font-mono text-[12px] uppercase text-readable">
          <div className="flex gap-8">
            <div>
              <span className="text-neon block">4–12 tuổi</span>
              <span>Độ tuổi phù hợp</span>
            </div>
            <div>
              <span className="text-neon block">100%</span>
              <span>An toàn cho trẻ</span>
            </div>
            <div>
              <span className="text-neon block">Thời gian thực</span>
              <span>Phân tích giọng nói</span>
            </div>
            <div>
              <span className="text-neon block">Gemini AI</span>
              <span>Công nghệ AI</span>
            </div>
          </div>
          <span>© 2026 BollyEnglish — Đại học FPT</span>
        </div>

      </div>
    </section>
  )
}
