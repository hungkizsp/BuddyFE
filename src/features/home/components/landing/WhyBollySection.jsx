import { useState } from 'react'

const EMOTION_LOGIC = {
  happy: {
    emoji: '😊',
    label: 'Vui vẻ',
    title: 'Vui Vẻ & Tự Tin',
    condition: 'Phát âm chính xác',
    desc: 'Khi bé phát âm đúng từ vựng, Bolly sẽ bày tỏ sự vui mừng và khích lệ chân thành. Sự công nhận kịp thời này giúp bé xây dựng sự tự tin và tạo niềm hứng khởi học tập không ngừng.',
  },
  encourage: {
    emoji: '💪',
    label: 'Động viên',
    title: 'Ân Cần Động Viên',
    condition: 'Cần cải thiện phát âm',
    desc: `Bolly không bao giờ phán xét "sai rồi". Thay vào đó, bạn ấy sẽ phát âm mẫu thật chậm rãi, rõ ràng và khuyến khích bé thử lại. Phương pháp kiên nhẫn này giúp bé tiếp thu tự nhiên mà không sợ mắc lỗi.`,
  },
  celebrate: {
    emoji: '🥳',
    label: 'Ăn mừng',
    title: 'Ăn Mừng Thành Tích',
    condition: 'Hoàn thành bài học hoặc nhiệm vụ',
    desc: 'Khi hoàn thành kịch bản, làm chủ bộ từ vựng hay duy trì chuỗi học, Bolly sẽ cùng bé ăn mừng tưng bừng. Bé nhận thêm xu thưởng, mở khóa các vùng đất mới và nhìn thấy rõ tiến trình trưởng thành của mình.',
  },
  thinking: {
    emoji: '🤔',
    label: 'Lắng nghe',
    title: 'Tập Trung Lắng Nghe',
    condition: 'Đang xử lý giọng nói',
    desc: 'Khi bé nói, Bolly nghiêng đầu lắng nghe chăm chú. Hệ thống ghi nhận âm thanh trực tiếp, chuyển thành văn bản và gửi đến máy chủ Spring Boot để AI Google Gemini phân tích tức thì.',
  },
}

const WHY_DIFFERENT = [
  {
    icon: '🧠',
    title: 'Trí nhớ dài hạn',
    desc: 'Khác với chatbot thông thường, Bolly ghi nhớ chính xác những gì bé đã học hôm qua, tuần trước và tháng trước. Mỗi buổi học tiếp nối liền mạch điểm dừng trước đó — không trùng lặp, không lãng phí thời gian.',
  },
  {
    icon: '🎭',
    title: 'Thấu hiểu cảm xúc',
    desc: `Bolly nhận biết biểu hiện của bé theo thời gian thực và điều chỉnh tâm trạng tương ứng. Khi bé gặp khó khăn? Bạn ấy nói chậm lại và đơn giản hóa. Khi bé làm tốt? Bạn ấy tăng độ khó và mở rộng vốn từ.`,
  },
  {
    icon: '🛡️',
    title: 'Phản hồi 100% an toàn cho trẻ',
    desc: 'Mọi câu trả lời của AI đều qua bộ lọc nội dung nghiêm ngặt trước khi đến với bé. Không có nội dung độc hại, không lạc đề — chỉ tập trung vào việc học tiếng Anh bổ ích.',
  },
  {
    icon: '🌍',
    title: 'Học qua tình huống thực tế',
    desc: `Thay vì các bài tập nhàm chán, bé được hòa mình vào các thế giới theo chủ đề — gọi món ở nhà hàng, khám phá sở thú, mua sắm ở siêu thị. Mỗi tình huống giúp từ vựng ghi sâu vào trí nhớ.`,
  },
]

export default function WhyBollySection({ username = 'Hung' }) {
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
      <div className="relative z-10 w-full max-w-[1831px] mx-auto px-4 sm:px-10 lg:px-16 py-12 sm:py-20 lg:py-32" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ── TOP ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-0 mb-12 sm:mb-16">
          
          {/* Left: Heading */}
          <div className="relative">
            <h2 className="font-grotesk text-[30px] sm:text-[56px] lg:text-[68px] uppercase leading-[1.08] text-cream text-glow">
              Gặp gỡ người bạn<br />
              AI của bé
            </h2>
            {/* Cursive Accent overlay */}
            <span className="font-condiment text-[32px] sm:text-[64px] lg:text-[76px] text-neon mix-blend-exclusion opacity-90 absolute bottom-[-8px] sm:bottom-[-10px] right-[-10px] sm:right-[-20px] -rotate-1 normal-case leading-none pointer-events-none text-glow">
              Bolly
            </span>
          </div>

          {/* Right: Description */}
          <p className="font-mono text-[14px] lg:text-[16px] uppercase text-cream/90 max-w-[380px] leading-relaxed text-readable">
            Bolly không chỉ là một ứng dụng học tập thông thường. Bạn ấy là một người bạn AI thông minh, thấu hiểu cảm xúc, luôn ghi nhớ hành trình của bé và biến mỗi cuộc trò chuyện tiếng Anh thành những giờ chơi bổ ích.
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
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-2">Hệ Thống Trí Nhớ Thích Ứng</span>
            <p className="font-mono text-[12px] uppercase text-cream/60 mb-4 leading-relaxed">
              Bolly lưu trữ mọi tương tác vào hồ sơ học tập cá nhân: từ vựng đã thành thạo, chủ đề đã khám phá, các lỗi hay gặp và tốc độ học tập tối ưu.
            </p>
            <div className="space-y-3 font-mono text-[13px] uppercase">
              <div className="bg-white/5 p-4 rounded-[16px] border border-white/5">
                <span className="text-neon block mb-1">Buổi học #14 — Hôm qua</span>
                <span className="text-cream/50">{username} đã luyện tập: </span>
                <span className="text-cream font-bold">Từ vựng hoa quả — Táo (Apple), Chuối (Banana), Cam (Orange), Nho (Grape)</span>
                <span className="text-cream/30 block mt-1">Độ chính xác phát âm: 78% → Bolly ghi nhận cần luyện thêm âm "R"</span>
              </div>
              <div className="text-center text-neon text-lg">↓</div>
              <div className="bg-[#6FFF00]/10 p-4 rounded-[16px] border border-[#6FFF00]/20">
                <span className="text-neon block mb-1">Buổi học #15 — Hôm nay</span>
                <span className="text-cream font-bold block">{`Bolly nói: "Chào mừng ${username} quay lại! Hôm qua bạn đã học 4 loại trái cây. Hôm nay chúng mình cùng ôn lại những từ bạn thấy hơi khó nhé — đặc biệt là 'grape' và 'orange'. Bạn sẵn sàng chưa?"`}</span>
                <span className="text-cream/30 block mt-1">→ Tự động kích hoạt bài ôn tập trọng tâm trước khi học bài mới</span>
              </div>
            </div>
          </div>

          {/* Emotion Decision Engine */}
          <div className="liquid-glass rounded-[32px] p-6">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-2">Cơ Chế Phân Tích Cảm Xúc</span>
            <p className="font-mono text-[12px] uppercase text-cream/60 mb-4 leading-relaxed">
              Cảm xúc của Bolly được điều khiển bởi hệ thống thông minh trên nền tảng Spring Boot, tự động đánh giá độ chính xác phát âm, phản xạ câu hỏi và tiến trình học tập để phản hồi khích lệ bé tốt nhất.
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
                  <span>{item.label || key}</span>
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
                <span>Hệ thống: Spring Boot + Gemini AI</span>
                <span>Độ trễ phản hồi: ~200ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: TECH + TARGET AUDIENCE ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start pt-10 border-t border-white/10 gap-10">
          
          {/* Left: Who is this for? */}
          <div className="max-w-[420px]">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-3 text-glow">Bolly dành cho ai?</span>
            <div className="space-y-3 font-mono text-[13px] uppercase text-cream/70 leading-relaxed text-readable">
              <p>→ Trẻ em Việt Nam từ 4–12 tuổi đang học và làm quen với tiếng Anh</p>
              <p>→ Phụ huynh tìm kiếm giải pháp tiếp cận công nghệ an toàn, bổ ích và lành mạnh</p>
              <p>→ Gia đình mong muốn có môi trường luyện nói chuẩn bản xứ ngay tại nhà</p>
              <p>→ Trường học và trung tâm cần công cụ tương tác luyện nói tiếng Anh với AI</p>
            </div>
          </div>

          {/* Right: Tech Stack */}
          <div className="max-w-[420px]">
            <span className="font-grotesk text-[14px] uppercase tracking-widest text-neon block mb-3 text-glow">Công nghệ phát triển</span>
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
