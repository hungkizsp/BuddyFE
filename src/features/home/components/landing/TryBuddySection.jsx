// Inline SVG icons (no external package needed)
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

const TEAM_MEMBERS = [
  { name: 'Nguyen Manh Hung', role: 'Fullstack Dev & AI Integration' },
  { name: 'Le Thi Hoa',       role: 'UX/UI Design & 3D Character' },
  { name: 'Tran Duc Anh',     role: 'Product Manager & QA' },
]

const PARENT_FEATURES = [
  {
    icon: '📊',
    title: 'Progress Dashboard',
    desc: 'Track vocabulary growth, speaking accuracy trends, daily streak data, and time spent learning — all in one clear parent dashboard.',
  },
  {
    icon: '🔒',
    title: 'Content Control',
    desc: 'Every AI response passes through age-appropriate content filters. Parents can review session transcripts and set daily time limits.',
  },
  {
    icon: '📱',
    title: 'Session Reports',
    desc: 'After each session, parents receive a summary: words practiced, pronunciation scores, areas for improvement, and recommendations.',
  },
  {
    icon: '⏰',
    title: 'Schedule & Reminders',
    desc: 'Set preferred practice times. Buddy will remind your child when it is time to learn, keeping the streak alive without parental nagging.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'What age is BuddyEnglish designed for?',
    a: 'BuddyEnglish is optimized for Vietnamese children aged 4–12 who are learning English as a second language. Vocabulary, scenarios, and speaking speed are calibrated for this age range.',
  },
  {
    q: 'Is it safe for my child to use?',
    a: 'Yes. Every AI response is filtered for age-appropriate content. Buddy cannot discuss topics outside of English learning. All data is stored securely with JWT authentication, and no personal data is shared with third parties.',
  },
  {
    q: 'How does the speech recognition work?',
    a: 'BuddyEnglish uses the Web Speech API built into modern browsers to capture your child\'s voice. The audio is converted to text locally, then sent to our Spring Boot backend for analysis by Google Gemini AI. No audio recordings are stored.',
  },
  {
    q: 'Does my child need a microphone?',
    a: 'Yes, a working microphone is required for speaking practice. Most laptops, tablets, and phones have built-in microphones that work perfectly. We recommend using headphones with a mic for the best experience.',
  },
  {
    q: 'How much does it cost?',
    a: 'BuddyEnglish is currently in beta and free to use. We plan to offer a freemium model with basic features available for free and premium worlds/scenarios available through a monthly subscription.',
  },
  {
    q: 'Can I track my child\'s progress?',
    a: 'Yes. The parent dashboard shows detailed analytics: vocabulary growth over time, pronunciation accuracy per session, daily streak tracking, and a full history of topics covered.',
  },
]

export default function TryBuddySection({ username = 'Hung' }) {
  const userInitial = username.charAt(0).toUpperCase()

  return (
    <section className="relative w-full bg-[#010828] overflow-hidden z-10">
      
      {/* ── CTA SECTION WITH VIDEO ── */}
      <div className="relative w-full video-darken">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block opacity-50"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4"
        />

        {/* ── TEXT CONTENT (Positioned absolute over the video) ── */}
        <div className="absolute inset-0 flex items-center justify-end z-20">
          <div className="w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-end">
            
            <div className="relative max-w-[65%] lg:pr-[10%] lg:pl-[5%] text-right">
              {/* Script overlay */}
              <span className="font-condiment text-[24px] sm:text-[42px] md:text-[56px] lg:text-[76px] text-neon mix-blend-exclusion opacity-90 absolute top-[-25px] sm:top-[-45px] lg:top-[-75px] left-[-30px] sm:left-[-50px] lg:left-[-70px] -rotate-1 normal-case leading-none pointer-events-none text-glow">
                Start today
              </span>

              {/* Heading */}
              <h2 className="font-grotesk text-[18px] sm:text-[36px] md:text-[48px] lg:text-[64px] uppercase leading-[1.05] text-cream text-left tracking-wide text-glow">
                <span className="block mb-4 sm:mb-8 lg:mb-12">Your child deserves</span>
                <span className="block">a friend who listens.</span>
                <span className="block">a teacher who adapts.</span>
                <span className="block">a companion who remembers.</span>
              </h2>

              {/* Demo Profile Card */}
              <div className="mt-6 lg:mt-12 liquid-glass rounded-[16px] sm:rounded-[28px] p-4 sm:p-6 max-w-[420px] text-left">
                <span className="font-grotesk text-[12px] uppercase tracking-widest text-neon block mb-3 text-glow">Live demo profile</span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] text-cream flex items-center justify-center font-grotesk text-xl font-bold">
                    {userInitial}
                  </div>
                  <div>
                    <span className="font-grotesk text-base uppercase text-cream block text-glow">{username}</span>
                    <span className="font-mono text-[11px] text-[#6FFF00] uppercase block font-bold text-readable">Level 3 — Food Forest Explorer</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] uppercase">
                  <div className="bg-white/5 p-2.5 rounded-[10px]">
                    <span className="text-cream/60 block mb-0.5">Speaking accuracy</span>
                    <span className="text-cream font-bold text-sm text-glow">83%</span>
                    <span className="text-neon block text-[10px] font-bold">↑ 12% this week</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-[10px]">
                    <span className="text-cream/60 block mb-0.5">Daily streak</span>
                    <span className="text-cream font-bold text-sm text-glow">5 Days</span>
                    <span className="text-neon block text-[10px] font-bold">Personal best: 12</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-[10px]">
                    <span className="text-cream/60 block mb-0.5">Words mastered</span>
                    <span className="text-cream font-bold text-sm text-glow">47 / 135</span>
                    <span className="text-neon block text-[10px] font-bold">Food Forest: 80%</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-[10px]">
                    <span className="text-cream/60 block mb-0.5">Today's missions</span>
                    <span className="text-cream font-bold text-sm text-glow">3 / 5 Done</span>
                    <span className="text-neon block text-[10px] font-bold">2 missions left</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 text-left flex gap-3 flex-wrap">
                <a href="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-neon to-[#88ff44] text-[#010828] font-grotesk text-sm sm:text-base uppercase tracking-wider rounded-full hover:scale-105 transition-transform font-bold">
                  Create free account
                </a>
                <a href="/login" className="inline-block liquid-glass px-8 py-4 font-grotesk text-sm sm:text-base uppercase tracking-wider rounded-full text-cream hover:bg-white/10 transition-all text-readable">
                  Watch demo
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── SOCIAL ICONS ── */}
        <div className="absolute left-[8%] bottom-[12%] sm:bottom-[15%] lg:bottom-[20%] z-20">
          <div className="liquid-glass rounded-[0.5rem] sm:rounded-[1.25rem] flex flex-col overflow-hidden">
            {[MailIcon, TwitterIcon, GithubIcon].map((Icon, i, arr) => (
              <button
                key={i}
                className={`flex items-center justify-center hover:bg-white/10 transition-all duration-300 text-cream/70 hover:text-cream
                  w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]
                  h-[14vw] sm:h-[4rem] md:h-[3.5rem] lg:h-[5.5rem]
                  ${i < arr.length - 1 ? 'border-b border-white/10' : ''}
                `}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── FOR PARENTS SECTION ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div id="parents" className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="relative">
            <h2 className="font-grotesk text-[36px] sm:text-[56px] uppercase leading-[1.05] text-cream text-glow">
              Built for<br />children
            </h2>
            <span className="font-condiment text-[40px] sm:text-[68px] text-neon mix-blend-exclusion opacity-90 absolute bottom-[-10px] right-[-20px] -rotate-1 normal-case leading-none pointer-events-none text-glow">
              trusted by parents
            </span>
          </div>
          <p className="font-mono text-[14px] uppercase text-cream/80 max-w-[420px] leading-relaxed text-readable">
            We understand that parents need to trust the technology their children use. BuddyEnglish is designed with safety, transparency, and parental control at its core.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-20 max-w-[1000px] mx-auto">
          {PARENT_FEATURES.map((f) => (
            <div key={f.title} className="liquid-glass rounded-[24px] p-5 hover:bg-white/5 transition-all duration-300 group">
              <span className="text-3xl block mb-3">{f.icon}</span>
              <span className="font-grotesk text-[16px] uppercase text-cream block mb-2 text-glow">{f.title}</span>
              <p className="font-mono text-[12px] text-cream/70 leading-relaxed uppercase group-hover:text-cream transition-colors text-readable">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── FAQ SECTION ── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div id="faq" className="pt-12 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h2 className="font-grotesk text-[36px] sm:text-[56px] uppercase leading-[1.05] text-cream text-glow">
              Frequently asked
            </h2>
            <span className="font-mono text-[13px] uppercase text-cream/60 text-readable">Got more questions? Contact us at buddyenglish@fpt.edu.vn</span>
          </div>

          <div className="flex flex-col gap-4 max-w-[1000px] mx-auto">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="liquid-glass rounded-[24px] p-5 hover:bg-white/5 transition-all duration-300">
                <span className="font-grotesk text-[16px] uppercase text-neon block mb-2 text-glow">{faq.q}</span>
                <p className="font-mono text-[12px] text-cream/80 leading-relaxed uppercase text-readable">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── FOOTER ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1831px] mx-auto w-full px-6 sm:px-10 lg:px-16 pb-10">
        <div className="pt-8 border-t border-white/10">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
            <div className="max-w-[400px]">
              <span className="font-grotesk text-[22px] uppercase text-cream block mb-3 text-glow">BuddyEnglish</span>
              <p className="font-mono text-[12px] uppercase text-cream/50 leading-relaxed text-readable">
                An AI-powered English speaking companion for Vietnamese children. Built as a capstone project at FPT University (EXE101) to demonstrate that technology can make language learning accessible, safe, and genuinely fun.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-grotesk text-[11px] uppercase tracking-widest text-neon">Team</span>
              {TEAM_MEMBERS.map((m) => (
                <div key={m.name} className="font-mono text-[10px] uppercase">
                  <span className="text-cream/60">{m.name}</span>
                  <span className="text-cream/20 ml-2">— {m.role}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon text-glow font-bold">Links</span>
              {['GitHub Repository', 'API Documentation', 'FPT University', 'Privacy Policy'].map((link) => (
                <a key={link} href="#" className="font-mono text-[12px] uppercase text-cream/60 hover:text-cream/90 transition-colors text-readable">{link}</a>
              ))}
            </div>
          </div>
          {/* Bottom row */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[11px] uppercase text-cream/40 text-readable">
            <span>© 2026 BuddyEnglish — EXE101 Capstone Project, FPT University</span>
            <span>Spring Boot · React · Google Gemini AI · SQL Server</span>
          </div>
        </div>
      </div>

    </section>
  )
}
