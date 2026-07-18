import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyResult({ results, modeName, onRetry, onReviewWeakWords }) {
  const navigate = useNavigate();

  if (!results) return null;

  const { score, totalWords, correctCount, wrongCount, durationSeconds, weakWords } = results;

  // Format duration into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center animate-slide-up">
      {/* Trophy / Icon */}
      <div className="text-6xl mb-4">🏆</div>

      <h1 className="font-grotesk text-3xl md:text-4xl text-cream font-bold mb-2">
        Session Completed!
      </h1>
      <p className="text-cream/60 text-sm md:text-base font-nunito mb-8">
        You successfully finished your {modeName} study session.
      </p>

      {/* Score and Stats Panel */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-2xl md:text-3xl font-mono font-bold text-neon">{score}%</div>
          <div className="text-xs text-cream/40 uppercase font-mono mt-1">Score</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-2xl md:text-3xl font-mono font-bold text-primary">
            {correctCount} / {totalWords}
          </div>
          <div className="text-xs text-cream/40 uppercase font-mono mt-1">Correct</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-2xl md:text-3xl font-mono font-bold text-accent">
            {formatTime(durationSeconds)}
          </div>
          <div className="text-xs text-cream/40 uppercase font-mono mt-1">Time</div>
        </div>
      </div>

      {/* Weak Words / Suggested Review */}
      {weakWords && weakWords.length > 0 && (
        <div className="text-left bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="font-grotesk text-lg font-bold text-danger mb-4 flex items-center gap-2">
            ⚠️ Words to review ({weakWords.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {weakWords.map((vocab) => (
              <div
                key={vocab.id}
                className="flex items-center justify-between border-b border-slate-800/60 pb-2 last:border-0"
              >
                <div>
                  <span className="font-bold text-cream text-base">{vocab.word}</span>
                  {vocab.phonetic && (
                    <span className="text-xs text-cream/45 font-mono ml-2">
                      {vocab.phonetic}
                    </span>
                  )}
                </div>
                <span className="text-sm text-cream/70 font-nunito">{vocab.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-grotesk font-semibold shadow-glow hover:scale-105 transition-all"
        >
          🔄 Study Again
        </button>
        {weakWords && weakWords.length > 0 && onReviewWeakWords && (
          <button
            onClick={() => onReviewWeakWords(weakWords.map((w) => w.id))}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-grotesk font-semibold shadow-glow hover:scale-105 transition-all"
          >
            ⚠️ Ôn lại từ đã sai
          </button>
        )}
        <button
          onClick={() => navigate('/study')}
          className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cream font-grotesk font-semibold border border-slate-700 hover:scale-105 transition-all"
        >
          🏠 Study Hub
        </button>
      </div>
    </div>
  );
}
