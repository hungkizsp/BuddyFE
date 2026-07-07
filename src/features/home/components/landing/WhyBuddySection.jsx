import { useState } from 'react'

const EMOTION_LOGIC = {
  happy: {
    emoji: '😊',
    title: 'Happy & Confident',
    condition: 'Correct pronunciation detected',
    desc: 'When your child pronounces a word correctly, Buddy lights up with genuine excitement. This positive reinforcement builds speaking confidence and motivates children to keep practicing without fear of making mistakes.',
  },
  encourage: {
    emoji: '💪',
    title: 'Gently Encouraging',
    condition: 'Pronunciation needs work',
    desc: `Buddy never says "wrong." Instead, he models the correct pronunciation slowly and clearly, then asks the child to try again. This patient approach mirrors how the best language tutors work — through encouragement, not correction.`,
  },
  celebrate: {
    emoji: '🥳',
    title: 'Celebrating Milestones',
    condition: 'Lesson or mission completed',
    desc: 'Completing a scenario, finishing a vocabulary set, or maintaining a streak triggers a full celebration from Buddy. Children earn coins, unlock new adventure worlds, and see their progress visually — making every achievement feel meaningful.',
  },
  thinking: {
    emoji: '🤔',
    title: 'Actively Listening',
    condition: 'Processing speech input',
    desc: 'While your child speaks, Buddy tilts his head and listens carefully. Behind the scenes, the Web Speech API captures audio, converts it to text, and sends it to our Spring Boot backend for AI-powered analysis using Google Gemini.',
  },
}

const WHY_DIFFERENT = [
  {
    icon: '🧠',
    title: 'Long-term memory',
    desc: 'Unlike generic chatbots, Buddy remembers what your child learned yesterday, last week, and last month. Each session starts exactly where the previous one ended — no repetition, no wasted time.',
  },
  {
    icon: '🎭',
    title: 'Emotional awareness',
    desc: `Buddy reads your child's performance in real-time and adapts his mood accordingly. Struggling? He slows down and simplifies. Excelling? He introduces harder vocabulary and faster pacing.`,
  },
  {
    icon: '🛡️',
    title: '100% child-safe responses',
    desc: 'Every AI response passes through a strict content filter before reaching your child. No inappropriate content, no off-topic conversations — only age-appropriate English learning.',
  },
  {
    icon: '🌍',
    title: 'Scenario-based learning',
    desc: `Instead of boring drills, children explore themed worlds — ordering food at a restaurant, visiting a zoo, shopping at a market. Each scenario teaches contextual vocabulary that sticks.`,
  },
]

export default function WhyBuddySection({ username = 'Hung' }) {
  const [selectedEmotion, setSelectedEmotion] = useState('happy')
  const em = EMOTION_LOGIC[selectedEmotion]

  return (
    <section id="about" className="relative min-h-screen bg-[#010828] overflow-hidden z-10 video-darken">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4"
      />

      {/* Main Container — above darken overlay */}
      <div className="relative z-10 w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ── TOP ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-0 mb-16">
          
          {/* Left: Heading */}
          <div className="relative">
            <h2 className="font-grotesk text-[36px] sm:text-[68px] uppercase leading-[1.05] text-cream text-glow">
              Meet your<br />
              AI companion
            </h2>
            {/* Cursive Accent overlay */}
            <span className="font-condiment text-[40px] sm:text-[76px] text-neon mix-blend-exclusion opacity-90 absolute bottom-[-10px] right-[-20px] -rotate-1 normal-case leading-none pointer-events-none text-glow">
              Buddy
            </span>
          </div>

          {/* Right: Description */}
          <p className="font-mono text-[14px] lg:text-[16px] uppercase text-cream/90 max-w-[380px] leading-relaxed text-readable">
            Buddy is not just another language app. He is a persistent, emotionally intelligent AI friend who remembers your child, adapts to their level, and makes every English conversation feel like play — not homework.
          </p>
        </div>

        {/* ── WHY DIFFERENT GRID ── */}
        <div className="flex flex-col gap-6 mb-16 max-w-[1000px] mx-auto">
          {WHY_DIFFERENT.map((item) => (
            <div key={item.title} className="liquid-glass rounded-[24px] p-5 hover:bg-white/5 transition-all duration-300 group">
              <span className="text-3xl block mb-3">{item.icon}</span>
              <span className="font-grotesk text-[16px] uppercase text-cream block mb-2 text-glow">{item.title}</span>
              <p className="font-mono text-[12px] text-cream/70 leading-relaxed uppercase group-hover:text-cream/90 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── MIDDLE ROW: INTERACTIVE PANELS ── */}
        <div className="flex flex-col gap-8 mb-16 max-w-[1000px] mx-auto">
          
          {/* Memory Timeline Card */}
          <div className="liquid-glass rounded-[32px] p-6">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-2">Adaptive Memory System</span>
            <p className="font-mono text-[12px] uppercase text-cream/60 mb-4 leading-relaxed">
              Buddy stores every interaction in a personalized learning profile. vocabulary mastered, topics explored, common mistakes, and preferred learning pace — all saved across sessions.
            </p>
            <div className="space-y-3 font-mono text-[13px] uppercase">
              <div className="bg-white/5 p-4 rounded-[16px] border border-white/5">
                <span className="text-neon block mb-1">Session #14 — Yesterday</span>
                <span className="text-cream/50">{username} practiced: </span>
                <span className="text-cream font-bold">Fruits vocabulary — Apple, Banana, Orange, Grape</span>
                <span className="text-cream/30 block mt-1">Pronunciation accuracy: 78% → Buddy noted "R" sounds need practice</span>
              </div>
              <div className="text-center text-neon text-lg">↓</div>
              <div className="bg-[#6FFF00]/10 p-4 rounded-[16px] border border-[#6FFF00]/20">
                <span className="text-neon block mb-1">Session #15 — Today</span>
                <span className="text-cream font-bold block">{`Buddy says: "Welcome back, ${username}! Yesterday you learned 4 new fruits. Today let's practice the ones you found tricky — especially 'grape' and 'orange.' Ready?"`}</span>
                <span className="text-cream/30 block mt-1">→ Automatically loads targeted review before new content</span>
              </div>
            </div>
          </div>

          {/* Emotion Decision Engine */}
          <div className="liquid-glass rounded-[32px] p-6">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-2">Emotion Decision Engine</span>
            <p className="font-mono text-[12px] uppercase text-cream/60 mb-4 leading-relaxed">
              {`Buddy's emotional state isn't random. It's driven by a rule-based engine in our Spring Boot backend that evaluates pronunciation accuracy, response time, streak data, and session progress to determine the most supportive reaction.`}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(EMOTION_LOGIC).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEmotion(key)}
                  className={`p-3 rounded-[12px] flex items-center gap-2 border font-mono text-[12px] uppercase text-left transition-all ${
                    selectedEmotion === key
                      ? 'bg-neon text-[#010828] border-neon font-bold scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{key}</span>
                </button>
              ))}
            </div>
            <div className="bg-white/5 p-4 rounded-[16px] font-mono text-[12px] uppercase">
              <div className="flex justify-between text-neon font-bold mb-2">
                <span>{em.title}</span>
                <span className="text-cream/40">{em.condition}</span>
              </div>
              <p className="text-cream/60 leading-relaxed">{em.desc}</p>
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-cream/20">
                <span>Engine: Spring Boot + Gemini AI</span>
                <span>Response latency: ~200ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: TECH + TARGET AUDIENCE ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start pt-10 border-t border-white/10 gap-10">
          
          {/* Left: Who is this for? */}
          <div className="max-w-[420px]">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-3 text-glow">Who is Buddy for?</span>
            <div className="space-y-3 font-mono text-[13px] uppercase text-cream/70 leading-relaxed text-readable">
              <p>→ Vietnamese children aged 4–12 who are learning English as a second language</p>
              <p>→ Parents who want a safe, screen-time-positive learning experience</p>
              <p>→ Families who cannot afford private English tutors but want quality practice</p>
              <p>→ Schools looking for supplementary AI-assisted speaking practice tools</p>
            </div>
          </div>

          {/* Right: Tech Stack */}
          <div className="max-w-[420px]">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-3 text-glow">Built with</span>
            <div className="flex flex-wrap gap-2">
              {['React', 'Three.js', 'Tailwind CSS', 'Spring Boot', 'SQL Server', 'Google Gemini AI', 'Web Speech API', 'JWT Auth', 'REST API', 'Cloudinary'].map((tech) => (
                <span key={tech} className="liquid-glass px-3 py-1.5 rounded-full font-mono text-[11px] uppercase text-cream/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
