import React from 'react';

const COLORS = [
  { name: 'yellow', value: '#FEF08A' }, // soft yellow
  { name: 'green', value: '#BBF7D0' },  // soft green
  { name: 'blue', value: '#BFDBFE' },   // soft blue
  { name: 'orange', value: '#FED7AA' }, // soft orange
  { name: 'pink', value: '#FBCFE8' },   // soft pink
];

export default function ColorToolbar({ position, onSelectColor, onClose, onClear }) {
  if (!position) return null;

  return (
    <div
      className="absolute z-50 flex items-center gap-1.5 bg-slate-800 border border-slate-700/60 rounded-xl px-2.5 py-1.5 shadow-xl animate-fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      {COLORS.map((color) => (
        <button
          key={color.name}
          onClick={() => onSelectColor(color.value)}
          className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125 focus:outline-none"
          style={{ backgroundColor: color.value }}
          title={`Highlight ${color.name}`}
        />
      ))}
      <div className="w-[1px] h-4 bg-slate-700 mx-1" />
      <button
        onClick={onClear}
        className="text-xs text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
        title="Clear highlights in selection"
      >
        🧹
      </button>
      <button
        onClick={onClose}
        className="text-xs text-slate-400 hover:text-white ml-1 font-bold"
        title="Close"
      >
        ✕
      </button>
    </div>
  );
}
