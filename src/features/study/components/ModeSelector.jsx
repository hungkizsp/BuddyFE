import React from 'react';

const MODES = [
  {
    id: 'flashcards',
    title: '📇 Thẻ Ghi Nhớ',
    description: 'Lật thẻ 3D để ôn lại từ vựng, phát âm chuẩn, nghĩa từ và câu ví dụ sinh động.',
    glowClass: 'hover:shadow-glow hover:border-primary/50',
    iconColor: 'text-primary',
  },
  {
    id: 'learn',
    title: '🧠 Học Từ Mới',
    description: 'Thử thách trí nhớ qua câu hỏi trắc nghiệm và gõ từ vựng tiếng Anh chính xác.',
    glowClass: 'hover:shadow-glow-green hover:border-neon/50',
    iconColor: 'text-neon',
  },
  {
    id: 'test',
    title: '📝 Thử Thách Kiểm Tra',
    description: 'Bài kiểm tra tổng hợp với đa dạng dạng bài, đếm ngược thời gian và chấm điểm ngay.',
    glowClass: 'hover:shadow-glow-gold hover:border-accent/50',
    iconColor: 'text-accent',
  },
  {
    id: 'match',
    title: '🧩 Ghép Từ Nhanh',
    description: 'Đua thời gian để ghép cặp từ tiếng Anh với hình ảnh và nghĩa tương ứng thật nhanh!',
    glowClass: 'hover:shadow-glow-coral hover:border-danger/50',
    iconColor: 'text-danger',
  },
];

export default function ModeSelector({ selectedMode, onSelectMode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      {MODES.map((mode) => {
        const isSelected = selectedMode === mode.id;

        return (
          <div
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden ${
              isSelected
                ? 'bg-slate-900/90 border-primary shadow-glow scale-[1.03]'
                : 'bg-slate-900/40 border-slate-800 hover:scale-[1.02] ' + mode.glowClass
            }`}
          >
            {isSelected && (
              <span className="absolute top-3 right-3 text-primary text-lg">
                ✨
              </span>
            )}
            <h3 className={`font-grotesk text-xl font-bold mb-3 ${mode.iconColor}`}>
              {mode.title}
            </h3>
            <p className="font-nunito text-sm text-cream/70 leading-relaxed">
              {mode.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
