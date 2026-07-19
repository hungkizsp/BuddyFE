import React, { useState, useRef, useEffect } from 'react';
import useHighlight from '../hooks/useHighlight';
import HighlightableText from './HighlightableText';

export default function FlashcardViewer({ vocab, childId, onSpeak }) {
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef(null);

  // Load highlight for the current vocab card
  const { highlights, saveHighlight } = useHighlight(childId, vocab?.id);

  // Reset flip state when vocabulary item changes
  useEffect(() => {
    setFlipped(false);
  }, [vocab]);

  if (!vocab) return null;

  const playAudio = (e) => {
    e.stopPropagation(); // prevent flipping when clicking speaker
    if (onSpeak) {
      onSpeak(vocab.word);
    } else if (vocab.audioUrl) {
      if (!audioRef.current) audioRef.current = new Audio(vocab.audioUrl);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleHighlightChange = (newHighlights) => {
    saveHighlight(newHighlights);
  };

  return (
    <div className="w-full max-w-xl aspect-[3/2] min-h-[350px] cursor-pointer group perspective-1000 mx-auto select-none">
      <div
        className={`relative w-full h-full duration-700 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setFlipped(!flipped)}
      >
        {/* FRONT SIDE (Word & phonetic) */}
        <div className="absolute inset-0 w-full h-full bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-8 flex flex-col justify-between items-center shadow-glass backface-hidden">
          <div className="w-full flex justify-end">
            <span className="font-mono text-xs text-cream/30 uppercase tracking-widest">
              Front
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 my-auto">
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold tracking-wide text-cream text-center uppercase">
              {vocab.word}
            </h2>
            {vocab.phonetic && (
              <p className="font-mono text-base md:text-lg text-primary">{vocab.phonetic}</p>
            )}

            <button
              onClick={playAudio}
              className="mt-4 w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary flex items-center justify-center transition-all hover:scale-110 shadow-glow"
              title="Pronounce word"
            >
              🔊
            </button>
          </div>

          <p className="font-mono text-[10px] text-cream/40 uppercase tracking-wider">
            Click to Flip Card
          </p>
        </div>

        {/* BACK SIDE (Meaning, example & image) */}
        <div className="absolute inset-0 w-full h-full bg-slate-900/95 border-2 border-primary/30 rounded-3xl p-8 flex flex-col justify-between items-center shadow-glow rotate-y-180 backface-hidden select-text">
          <div className="w-full flex justify-between items-center select-none">
            <span className="font-mono text-xs text-primary uppercase tracking-widest">
              Back (Meaning)
            </span>
            <button
              onClick={playAudio}
              className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm"
              title="Pronounce word"
            >
              🔊
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-6 my-auto items-center">
            {/* Image (if exists) */}
            {vocab.imageUrl && (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700 select-none">
                <img
                  src={vocab.imageUrl}
                  alt={vocab.word}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Meanings and Example with HighlightableText */}
            <div className="flex-1 space-y-4 text-left w-full">
              <div>
                <p className="font-mono text-[10px] text-cream/40 uppercase tracking-widest mb-1 select-none">
                  Meaning
                </p>
                <div className="text-lg md:text-xl font-nunito font-semibold text-cream">
                  <HighlightableText
                    text={vocab.meaning}
                    highlights={highlights}
                    field="meaning"
                    onHighlightChange={handleHighlightChange}
                  />
                </div>
              </div>

              {vocab.exampleSentence && (
                <div>
                  <p className="font-mono text-[10px] text-cream/40 uppercase tracking-widest mb-1 select-none">
                    Example
                  </p>
                  <div className="text-sm md:text-base font-nunito italic text-cream/80">
                    <HighlightableText
                      text={`"${vocab.exampleSentence}"`}
                      highlights={highlights}
                      field="exampleSentence"
                      onHighlightChange={handleHighlightChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="font-mono text-[10px] text-cream/40 uppercase tracking-wider select-none">
            Click to Flip Card | Click text drag to Highlight
          </p>
        </div>
      </div>
    </div>
  );
}
