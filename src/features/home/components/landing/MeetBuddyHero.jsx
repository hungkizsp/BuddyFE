import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import SharedBuddyModel from '../../../../shared/components/BuddyModel'

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
  { name: 'About', href: '#about' },
  { name: 'Worlds', href: '#worlds' },
  { name: 'For Parents', href: '#parents' },
  { name: 'FAQ', href: '#faq' }
]

function InteractiveBuddy({ reaction }) {
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
      <SharedBuddyModel />
    </group>
  )
}

function BuddyScene({ reaction }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 4.2], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={2.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#fff5e0" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#6060ff" />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <InteractiveBuddy reaction={reaction} />
      </Suspense>
    </Canvas>
  )
}

function SocialIcons() {
  return (
    <>
      {[MailIcon, TwitterIcon, GithubIcon].map((Icon, i) => (
        <button
          key={i}
          className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-all duration-300"
        >
          <Icon />
        </button>
      ))}
    </>
  )
}

export default function MeetBuddyHero({ onLearnMore }) {
  const [bubbleText, setBubbleText] = useState("Hi there! I'm Buddy — your AI English speaking companion. I listen, I remember, and I grow with you every day!")
  const [reaction, setReaction] = useState(null)

  const triggerReaction = (text, type) => {
    setBubbleText(text)
    setReaction(type)
    setTimeout(() => setReaction(null), 1500)
  }

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

      {/* 3D Buddy Canvas */}
      <div className="absolute inset-0 left-[35%] z-10 pointer-events-none md:pointer-events-auto">
        <BuddyScene reaction={reaction} />
      </div>

      {/* Main Container — sits above video-darken overlay (z-index > 1) */}
      <div className="relative z-20 w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col min-h-screen justify-between pb-10">
        
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between pt-7">
          {/* Logo */}
          <span className="font-grotesk text-xl uppercase text-cream tracking-widest text-glow">
            BollyEnglish
          </span>

          {/* Navigation */}
          <nav className="liquid-glass hidden lg:flex items-center gap-10 rounded-[28px] px-[52px] py-[24px]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-grotesk text-[15px] uppercase text-cream hover:text-neon transition-colors duration-200 text-readable"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Icons (Desktop) */}
          <div className="hidden lg:flex flex-col gap-3">
            <SocialIcons />
          </div>
        </div>

        {/* ── HERO CONTENT ── */}
        <div className="flex-1 flex flex-col justify-center py-10">
          <div className="relative w-full max-w-[780px] lg:ml-32">
            <h1 className="font-grotesk text-[44px] sm:text-[68px] md:text-[82px] lg:text-[100px] uppercase leading-[1.05] md:leading-[1] text-cream text-glow">
              Beyond classrooms<br />
              and ( their ) familiar limits
            </h1>

            {/* Script overlay */}
            <span className="font-condiment text-[28px] sm:text-[42px] md:text-[56px] text-neon -rotate-1 mix-blend-exclusion opacity-90 absolute right-4 lg:right-[20px] bottom-[-20px] leading-none normal-case pointer-events-none text-glow">
              speak with Buddy
            </span>
          </div>

          {/* Sub-description */}
          <p className="font-mono text-[14px] sm:text-[16px] uppercase text-cream/80 max-w-[560px] mt-8 lg:ml-32 leading-relaxed text-readable">
            An AI-powered speaking companion designed for Vietnamese children aged 4–12. Buddy uses real-time speech recognition, adaptive memory, and emotional intelligence to help kids practice English naturally — anytime, anywhere, without fear of judgment.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 mt-8 lg:ml-32">
            <a href="/login" className="inline-block px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-neon to-[#88ff44] text-[#010828] font-grotesk text-sm sm:text-base uppercase tracking-wider rounded-full hover:scale-105 transition-transform font-bold">
              Try Buddy Free
            </a>
            <button onClick={onLearnMore} className="liquid-glass px-8 py-4 sm:px-10 sm:py-5 font-grotesk text-sm sm:text-base uppercase tracking-wider rounded-full text-cream hover:bg-white/10 transition-all text-readable">
              Learn More
            </button>
          </div>

          {/* Social Icons (Mobile) */}
          <div className="flex lg:hidden gap-3 mt-10 justify-start">
            <SocialIcons />
          </div>
        </div>

        {/* ── SPEECH BUBBLE ── */}
        <div className="absolute right-[4%] lg:right-[6%] top-[14%] lg:top-[18%] max-w-[260px] sm:max-w-[300px] liquid-glass rounded-2xl rounded-tr-none p-5 z-30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-neon font-bold">Buddy online</span>
          </div>
          <p className="font-mono text-[13px] text-cream leading-relaxed">{bubbleText}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => triggerReaction("Great to see you! Let me show you how I help kids speak English with confidence. Just talk to me like a friend!", 'wave')}
              className="font-mono text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 text-cream/80 rounded-lg border border-white/10 transition-all"
            >
              👋 Wave
            </button>
            <button
              onClick={() => triggerReaction("I remember everything we practiced together! Yesterday we learned about animals. Ready to continue today?", 'nod')}
              className="font-mono text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 text-[#6FFF00] rounded-lg border border-[#6FFF00]/20 transition-all"
            >
              😊 Smile
            </button>
          </div>
        </div>

        {/* ── BOTTOM STATS BAR ── */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-cream/50 font-mono text-[12px] uppercase text-readable">
          <div className="flex gap-8">
            <div>
              <span className="text-neon block">4–12</span>
              <span>Target age</span>
            </div>
            <div>
              <span className="text-neon block">100%</span>
              <span>Child-safe AI</span>
            </div>
            <div>
              <span className="text-neon block">Real-time</span>
              <span>Speech analysis</span>
            </div>
            <div>
              <span className="text-neon block">Gemini AI</span>
              <span>Powered by</span>
            </div>
          </div>
          <span>© 2026 BuddyEnglish — FPT University</span>
        </div>

      </div>
    </section>
  )
}
