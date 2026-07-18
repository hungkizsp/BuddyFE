import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyProgressBar({ current, total, modeName, onExit }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Exit button */}
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-cream/60 hover:text-white transition-colors font-mono uppercase"
        >
          ✕ Exit
        </button>

        {/* Center: Title / Mode */}
        <span className="font-grotesk text-sm font-semibold tracking-wider uppercase text-primary">
          {modeName} Mode
        </span>

        {/* Right: Progress Text */}
        <span className="font-mono text-sm text-cream/40">
          {current} / {total}
        </span>
      </div>

      {/* Progress Track */}
      <div className="max-w-7xl mx-auto mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
