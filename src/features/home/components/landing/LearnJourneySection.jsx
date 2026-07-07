const WORLDS_DATA = [
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    title: 'Food Forest',
    desc: 'Practice ordering food, naming ingredients, and describing meals. Vocabulary includes fruits, vegetables, drinks, and common restaurant phrases.',
    vocab: '45 Words',
    scenarios: '6 Scenarios',
    difficulty: 'Beginner',
  },
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    title: 'Animal Kingdom',
    desc: 'Explore the zoo and farm with Buddy. Learn animal names, describe their features, and practice sentences like "The elephant is big and grey."',
    vocab: '52 Words',
    scenarios: '8 Scenarios',
    difficulty: 'Intermediate',
  },
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    title: 'Market Adventure',
    desc: 'Go shopping with Buddy! Practice numbers, colors, sizes, and real-world transactions. "How much is this red shirt?" — learning through play.',
    vocab: '38 Words',
    scenarios: '5 Scenarios',
    difficulty: 'Beginner',
  },
]

export default function LearnJourneySection() {
  return (
    <section id="worlds" className="relative bg-[#010828] overflow-hidden py-16 lg:py-24 z-10">
      
      {/* Container */}
      <div className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* ── HEADER ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          
          {/* Left: Heading */}
          <div>
            <h2 className="font-grotesk text-[36px] sm:text-[68px] uppercase leading-[1.05] text-cream text-glow">
              Explore Buddy's
            </h2>
            <div className="ml-12 sm:ml-24 lg:ml-32 flex items-baseline gap-3">
              <span className="font-condiment text-[40px] sm:text-[76px] text-neon normal-case leading-none -rotate-1 inline-block text-glow">learning</span>
              <span className="font-grotesk text-[36px] sm:text-[68px] uppercase text-cream leading-tight text-glow">worlds</span>
            </div>
          </div>

          {/* Right: VIEW ALL WORLDS button */}
          <div className="flex-shrink-0 cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="font-grotesk text-[32px] sm:text-[60px] uppercase text-cream leading-none">
                VIEW
              </span>
              <div className="flex flex-col font-grotesk uppercase leading-none">
                <span className="text-[20px] sm:text-[36px] text-cream/70">ALL</span>
                <span className="text-[20px] sm:text-[36px] text-cream/70">WORLDS</span>
              </div>
            </div>
            {/* Underbar */}
            <div className="h-[6px] sm:h-[10px] w-full bg-neon mt-2 transition-all duration-300 group-hover:opacity-85" />
          </div>
        </div>

        {/* Section description */}
        <p className="font-mono text-[14px] lg:text-[16px] uppercase text-cream/90 max-w-[800px] leading-relaxed mb-12 text-readable">
          Each world is a themed learning environment where children practice English through immersive scenarios. Vocabulary is taught in context — not through flashcards, but through conversation. Buddy guides the child through each scenario step by step, adapting difficulty based on real-time performance.
        </p>

        {/* ── WORLD CARD GRID ── */}
        <div className="flex flex-col gap-8 mb-20 max-w-[1000px] mx-auto">
          {WORLDS_DATA.map((world, i) => (
            <div
              key={i}
              className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-300 group"
            >
              {/* Square video container */}
              <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden mb-4 bg-[#020d3d]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={world.videoUrl}
                />
                {/* World name overlay on video */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#010828] via-[#010828]/80 to-transparent p-4 pt-12">
                  <span className="font-grotesk text-[22px] uppercase text-cream block text-glow">{world.title}</span>
                  <span className="font-mono text-[11px] uppercase text-neon font-bold text-readable">{world.difficulty}</span>
                </div>
              </div>

              {/* World description */}
              <p className="font-mono text-[12px] uppercase text-cream/80 leading-relaxed px-1 mb-4 group-hover:text-cream transition-colors text-readable">
                {world.desc}
              </p>

              {/* Stats Overlay Bar */}
              <div className="liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-cream/60 uppercase block">Vocabulary</span>
                    <span className="font-grotesk text-[16px] text-cream text-glow">{world.vocab}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-cream/60 uppercase block">Scenarios</span>
                    <span className="font-grotesk text-[16px] text-cream text-glow">{world.scenarios}</span>
                  </div>
                </div>
                {/* Explore button */}
                <button className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── HOW A SESSION WORKS — JOURNEY MAP ── */}
        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
            <h3 className="font-grotesk text-[28px] sm:text-[44px] uppercase text-cream tracking-widest text-glow">
              How a session works
            </h3>
            <p className="font-mono text-[13px] uppercase text-cream/60 max-w-[460px] leading-relaxed text-readable">
              Every learning session follows a proven 5-step pedagogical flow designed to maximize retention and minimize frustration.
            </p>
          </div>
          <div className="relative border-l border-white/10 ml-4 sm:ml-16 lg:ml-32 pl-8 sm:pl-14 space-y-10">
            {[
              {
                num: '01',
                title: 'Personalized Greeting',
                sub: 'Buddy checks your profile, remembers your last session, and sets today\'s learning goal based on your progress history. No two greetings are ever the same. When the session starts, Buddy leverages your historic profile database to craft a uniquely tailored greeting in real-time. If you struggled with specific vowel sounds or animal vocabulary in your last session, Buddy will greet you with a gentle, friendly reminder and a mini-warmup challenge. By checking your current coin balance, streak level, and previous performance metrics, Buddy makes you feel immediately recognized, establishing a supportive, comfortable, and low-stress space before diving into today\'s core lessons.',
                color: '#6FFF00',
              },
              {
                num: '02',
                title: 'Scenario Immersion',
                sub: 'You enter a themed world (e.g., Food Forest) and begin a guided conversation. Buddy asks questions, you respond by speaking. The Web Speech API captures your voice in real-time. Instead of memorizing isolated tables or boring grammatical rules, your child enters an interactive 3D universe. They act as explorers, performing contextual tasks like ordering food at a village restaurant, asking directions from a talking rabbit, or purchasing supplies at a market. Buddy acts as the companion in these scenarios, asking questions, offering clues, and prompting answers. Using the Web Speech API integrated in modern web browsers, the voice stream is captured safely and processed locally without recording audio files.',
                color: '#b724ff',
              },
              {
                num: '03',
                title: 'AI Analysis & Feedback',
                sub: 'Your speech is converted to text and sent to the Spring Boot backend. Google Gemini AI evaluates pronunciation accuracy, grammar, and vocabulary usage — then generates personalized feedback. The text input is securely routed to our robust Spring Boot backend server, which forwards the request to Google\'s Gemini AI. The AI does not just check spelling; it conducts a semantic analysis of the sentence structure, grammar correctness, and contextual relevance. Within milliseconds, the backend calculates a comprehensive accuracy score. It isolates specific areas of difficulty, highlights mispronounced words, and constructs positive, highly encouraging feedback tailored specifically to a child\'s psychological needs.',
                color: '#6FFF00',
              },
              {
                num: '04',
                title: 'Rewards & Progress',
                sub: 'Correct responses earn coins and XP. Complete a full scenario to unlock the next world. Maintain a daily streak to earn bonus rewards. Every milestone is celebrated with Buddy\'s animations. To keep kids excited, our system features a fully integrated gamification engine. Every correct answer earns experience points (XP) and shiny gold coins that accumulate in the profile. When children hit major milestones or complete an entire themed scenario, they receive congratulations from Buddy, accompanied by dynamic 3D celebrations and animations. Daily streaks encourage children to practice regularly, forming a healthy habit. Earned coins can be used to unlock new customization options and companion badges.',
                color: '#b724ff',
              },
              {
                num: '05',
                title: 'Session Memory Saved',
                sub: 'Everything you practiced — words mastered, areas of difficulty, time spent, pronunciation scores — is saved to your child profile in SQL Server. Tomorrow, Buddy picks up exactly where you left off. The moment the session ends, our backend engine writes a structured database entry to SQL Server. This learning footprint documents every word spoken, pronunciation scores, time spent, and error categories. This persistent memory allows the AI system to build an evolutionary model of the child\'s skills. When they return tomorrow, the system automatically adapts, generating custom reviews for weak spots before introducing new lessons, ensuring a continuous, personalized learning journey.',
                color: '#6FFF00',
              },
            ].map((step) => (
              <div key={step.num} className="relative group">
                {/* Node */}
                <div className="absolute left-[-41px] sm:left-[-57px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                  style={{ borderColor: step.color, background: '#010828' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.color }} />
                </div>
                <div className="liquid-glass p-6 sm:p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 max-w-[850px]">
                  <span className="font-grotesk text-[20px] sm:text-[24px] uppercase text-cream block mb-2 text-glow">{step.title}</span>
                  <p className="font-mono text-[13px] uppercase leading-relaxed text-cream/90 text-readable">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
