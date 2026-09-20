import { useNavigate } from 'react-router-dom'

const WORLDS_DATA = [
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    title: 'Khu Rừng Thức Ăn',
    desc: 'Luyện tập gọi món ăn, đọc tên các nguyên liệu và mô tả bữa ăn. Từ vựng bao gồm trái cây, rau củ, đồ uống và câu giao tiếp nhà hàng.',
    vocab: '45 Từ vựng',
    scenarios: '6 Kịch bản',
    difficulty: 'Dễ (Cơ bản)',
  },
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    title: 'Vương Quốc Động Vật',
    desc: 'Khám phá sở thú và trang trại cùng Bolly. Học tên các loài động vật, mô tả đặc điểm và luyện mẫu câu "The elephant is big and grey."',
    vocab: '52 Từ vựng',
    scenarios: '8 Kịch bản',
    difficulty: 'Trung bình',
  },
  {
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    title: 'Cuộc Phiêu Lưu Ở Chợ',
    desc: 'Cùng Bolly đi mua sắm! Luyện tập chữ số, màu sắc, kích cỡ và giao dịch đời thực. "How much is this red shirt?" — vừa học vừa chơi.',
    vocab: '38 Từ vựng',
    scenarios: '5 Kịch bản',
    difficulty: 'Dễ (Cơ bản)',
  },
]

export default function LearnJourneySection({ currentUser }) {
  const navigate = useNavigate()

  const handleExploreWorld = (title) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    const normalized = title.toLowerCase()
    if (normalized.includes('forest') || normalized.includes('rừng')) {
      navigate('/adventure/food-forest')
    } else if (normalized.includes('market') || normalized.includes('chợ')) {
      navigate('/adventure/food-forest/supermarket-shopping')
    } else {
      navigate('/adventure')
    }
  }

  return (
    <section id="worlds" className="relative bg-[#010828] overflow-hidden py-16 lg:py-24 z-10">
      
      {/* Container */}
      <div className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* ── HEADER ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          
          {/* Left: Heading */}
          <div>
            <h2 className="font-grotesk text-[36px] sm:text-[68px] uppercase leading-[1.05] text-cream text-glow">
              Khám phá thế giới
            </h2>
            <div className="ml-12 sm:ml-24 lg:ml-32 flex items-baseline gap-3">
              <span className="font-condiment text-[40px] sm:text-[76px] text-neon normal-case leading-none -rotate-1 inline-block text-glow">học tập cùng</span>
              <span className="font-grotesk text-[36px] sm:text-[68px] uppercase text-cream leading-tight text-glow">Bolly</span>
            </div>
          </div>

          {/* Right: VIEW ALL WORLDS button */}
          <div
            onClick={() => navigate(currentUser ? '/adventure' : '/login')}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="font-grotesk text-[32px] sm:text-[60px] uppercase text-cream leading-none">
                XEM
              </span>
              <div className="flex flex-col font-grotesk uppercase leading-none">
                <span className="text-[20px] sm:text-[36px] text-cream/70">TẤT CẢ</span>
                <span className="text-[20px] sm:text-[36px] text-cream/70">THẾ GIỚI</span>
              </div>
            </div>
            {/* Underbar */}
            <div className="h-[6px] sm:h-[10px] w-full bg-neon mt-2 transition-all duration-300 group-hover:opacity-85" />
          </div>
        </div>

        {/* Section description */}
        <p className="font-mono text-[14px] lg:text-[16px] uppercase text-cream/90 max-w-[800px] leading-relaxed mb-12 text-readable">
          Mỗi thế giới là một môi trường học tập theo chủ đề, nơi các bé thực hành tiếng Anh qua các kịch bản nhập vai sinh động. Từ vựng được tiếp thu tự nhiên qua hội thoại thay vì học vẹt. Bolly sẽ đồng hành hướng dẫn từng bước và điều chỉnh độ khó phù hợp với bé.
        </p>

        {/* ── WORLD CARD GRID ── */}
        <div className="flex flex-col gap-8 mb-20 max-w-[1000px] mx-auto">
          {WORLDS_DATA.map((world, i) => (
            <div
              key={i}
              onClick={() => handleExploreWorld(world.title)}
              className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
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
                    <span className="font-mono text-[11px] text-cream/60 uppercase block">Từ vựng</span>
                    <span className="font-grotesk text-[16px] text-cream text-glow">{world.vocab}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-cream/60 uppercase block">Kịch bản</span>
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
              Quy trình buổi học
            </h3>
            <p className="font-mono text-[13px] uppercase text-cream/60 max-w-[460px] leading-relaxed text-readable">
              Mỗi buổi học theo sát quy trình 5 bước được tối ưu giúp bé nhớ lâu và học tập đầy hứng thú.
            </p>
          </div>
          <div className="relative border-l border-white/10 ml-4 sm:ml-16 lg:ml-32 pl-8 sm:pl-14 space-y-10">
            {[
              {
                num: '01',
                title: 'Chào hỏi cá nhân hóa',
                sub: 'Bolly nhận diện hồ sơ của bé, ghi nhớ buổi học trước và thiết lập mục tiêu bài học mới dựa trên tiến trình cá nhân.',
                color: '#6FFF00',
              },
              {
                num: '02',
                title: 'Nhập vai vào kịch bản',
                sub: 'Bé bước vào thế giới phiêu lưu (như Khu Rừng Thức Ăn) và trò chuyện trực tiếp cùng Bolly bằng giọng nói.',
                color: '#b724ff',
              },
              {
                num: '03',
                title: 'Phân tích AI & Nhận xét',
                sub: 'Trí tuệ nhân tạo Gemini đánh giá độ chính xác phát âm, ngữ pháp và đưa ra lời khen ngợi, động viên tức thì.',
                color: '#6FFF00',
              },
              {
                num: '04',
                title: 'Thưởng xu & Lên cấp',
                sub: 'Trả lời đúng nhận ngay xu vàng và kinh nghiệm (XP). Hoàn thành kịch bản để mở khóa các thế giới tiếp theo!',
                color: '#b724ff',
              },
              {
                num: '05',
                title: 'Session Memory Saved',
                sub: 'Everything you practiced — words mastered, areas of difficulty, time spent, pronunciation scores — is saved to your child profile in SQL Server. Tomorrow, Bolly picks up exactly where you left off. The moment the session ends, our backend engine writes a structured database entry to SQL Server. This learning footprint documents every word spoken, pronunciation scores, time spent, and error categories. This persistent memory allows the AI system to build an evolutionary model of the child\'s skills. When they return tomorrow, the system automatically adapts, generating custom reviews for weak spots before introducing new lessons, ensuring a continuous, personalized learning journey.',
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
