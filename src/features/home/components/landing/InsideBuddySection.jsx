const PIPELINE_NODES = [
  {
    step: '01',
    name: 'Child Input',
    sub: 'Microphone Speak',
    desc: 'Child speaks naturally into their microphone.'
  },
  {
    step: '02',
    name: 'Speech Conversion',
    sub: 'Web Speech API',
    desc: 'Transforms spoken words into textual data in real-time.'
  },
  {
    step: '03',
    name: 'AI Analysis',
    sub: 'Gemini API',
    desc: 'Evaluates grammar accuracy, vocabulary complexity, and pronunciation.'
  },
  {
    step: '04',
    name: 'Buddy Decision',
    sub: 'Spring Boot Engine',
    desc: 'Determines the responsive emotion, animation triggers, XP rewards, and streaks.'
  },
  {
    step: '05',
    name: 'Learning History',
    sub: 'MySQL Database',
    desc: 'Saves performance records to personalize future conversations.'
  }
]

const TECH_STACK = [
  { name: 'React', type: 'Frontend Framework' },
  { name: 'Spring Boot', type: 'Backend Service' },
  { name: 'Gemini API', type: 'AI Language Model' },
  { name: 'MySQL', type: 'Relational Database' },
  { name: 'Web Speech API', type: 'STT & Speech Engine' },
  { name: 'Tailwind CSS', type: 'Styling & Layout' },
  { name: 'Three.js / Fiber', type: '3D Render Canvas' }
]

export default function InsideBuddySection() {
  return (
    <section className="relative bg-[#020c35] text-cream py-24 px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-white/5">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,159,67,0.04),transparent_50%)] pointer-events-none" />

      <div className="max-w-[1831px] mx-auto z-10 relative">
        
        {/* Title */}
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <span className="font-mono text-neon text-sm uppercase tracking-widest font-semibold">Under The Hood</span>
          <h2 className="font-grotesk text-[40px] sm:text-[60px] uppercase mt-4 mb-6 leading-tight">
            Inside Buddy's Brain
          </h2>
          <p className="font-mono text-sm sm:text-base text-cream/60 uppercase leading-relaxed max-w-[600px] mx-auto">
            Understanding the technology flow that turns raw speech into an empathetic, rewarding conversation.
          </p>
        </div>

        {/* Architecture Flow Map */}
        <div className="mb-24">
          <h3 className="font-grotesk text-2xl uppercase mb-8 text-center text-neon">Interactive Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            
            {PIPELINE_NODES.map((node, idx) => {
              return (
                <div key={idx} className="relative flex flex-col items-center text-center bg-[#010828]/60 border border-white/5 hover:border-neon/20 p-6 rounded-2xl transition-all duration-300 group">
                  
                  {/* Arrow Indicator (except last node) */}
                  {idx < 4 && (
                    <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 text-neon font-bold text-xl animate-pulse">
                      ➔
                    </div>
                  )}

                  <span className="font-mono text-xs font-bold text-neon bg-neon/10 px-2 py-1 rounded-md mb-4 block">
                    STEP {node.step}
                  </span>

                  <h4 className="font-grotesk text-lg uppercase mb-1 group-hover:text-neon transition-colors">
                    {node.name}
                  </h4>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/40 mb-3 block">
                    {node.sub}
                  </span>
                  
                  <p className="font-mono text-[11px] text-cream/60 leading-relaxed uppercase mt-auto">
                    {node.desc}
                  </p>
                </div>
              )
            })}

          </div>
        </div>

        {/* Tech Stack Layout */}
        <div className="bg-[#010828]/30 border border-white/10 rounded-3xl p-8 lg:p-12">
          <h3 className="font-grotesk text-2xl uppercase mb-6 text-center">Engineered with Modern Technologies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {TECH_STACK.map((tech, idx) => (
              <div 
                key={idx} 
                className="bg-[#010828] border border-white/10 px-6 py-4 rounded-xl flex flex-col items-center hover:border-neon/40 transition-colors cursor-default"
              >
                <span className="font-grotesk text-lg text-cream uppercase">{tech.name}</span>
                <span className="font-mono text-[10px] text-neon uppercase mt-1 tracking-wider">{tech.type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
