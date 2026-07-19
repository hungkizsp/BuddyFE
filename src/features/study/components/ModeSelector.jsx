import React from 'react';

const MODES = [
  {
    id: 'flashcards',
    title: '📇 Flashcards',
    description: 'Flip cards 3D to review words, phonetic pronunciation, meaning and example sentences.',
    glowClass: 'hover:shadow-glow hover:border-primary/50',
    iconColor: 'text-primary',
  },
  {
    id: 'learn',
    title: '🧠 Learn',
    description: 'Test your memory with multiple choice and typed spelling answers with spaced repetition.',
    glowClass: 'hover:shadow-glow-green hover:border-neon/50',
    iconColor: 'text-neon',
  },
  {
    id: 'test',
    title: '📝 Test',
    description: 'Simulate a real exam session with mix question formats, timer limits and score reports.',
    glowClass: 'hover:shadow-glow-gold hover:border-accent/50',
    iconColor: 'text-accent',
  },
  {
    id: 'match',
    title: '🧩 Match',
    description: 'Race against time to match cards with words and definitions as fast as possible.',
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
