import React, { useState, useEffect } from 'react';

export default function LearnQuestion({
  vocab,
  choices,
  isAnswered,
  correctAnswer,
  selectedAnswer,
  onSubmit,
}) {
  const [typedInput, setTypedInput] = useState('');
  const [questionType, setQuestionType] = useState('mcq'); // 'mcq' or 'typed'

  // Decide question type based on word difficulty/mastery or alternate randomly
  useEffect(() => {
    setTypedInput('');
    // 50% chance of MCQ, 50% chance of typed spelling
    setQuestionType(Math.random() > 0.5 ? 'typed' : 'mcq');
  }, [vocab]);

  if (!vocab) return null;

  const handleSubmitTyped = (e) => {
    e.preventDefault();
    if (!typedInput.trim() || isAnswered) return;
    const isCorrect = typedInput.trim().toLowerCase() === vocab.word.toLowerCase();
    onSubmit(isCorrect, typedInput.trim());
  };

  const handleSelectMCQ = (choice) => {
    if (isAnswered) return;
    const isCorrect = choice.toLowerCase() === vocab.word.toLowerCase();
    onSubmit(isCorrect, choice);
  };

  return (
    <div className="w-full max-w-xl bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-glass mx-auto animate-slide-up">
      {/* Prompt / Question */}
      <div className="mb-6 text-center">
        <span className="font-mono text-xs text-cream/40 uppercase tracking-widest block mb-2">
          {questionType === 'mcq' ? 'Choose the correct English word' : 'Write the English translation'}
        </span>

        {/* Optional Image */}
        {vocab.imageUrl && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 mx-auto mb-4 border border-slate-700">
            <img src={vocab.imageUrl} alt="hint" className="w-full h-full object-cover" />
          </div>
        )}

        <h2 className="font-grotesk text-2xl font-bold text-cream mb-1">
          {vocab.meaning}
        </h2>
        {vocab.exampleSentence && (
          <p className="font-nunito text-sm text-cream/50 italic mt-1">
            "{vocab.exampleSentence.replace(new RegExp(vocab.word, 'gi'), '_____')}"
          </p>
        )}
      </div>

      {/* Answer inputs */}
      {!isAnswered ? (
        questionType === 'mcq' ? (
          /* MCQ Choices Grid */
          <div className="grid grid-cols-1 gap-3">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleSelectMCQ(choice)}
                className="w-full text-left px-5 py-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-cream font-grotesk font-semibold hover:scale-[1.01] transition-all"
              >
                <span className="inline-block w-6 text-primary">{i + 1}.</span>
                <span className="capitalize">{choice}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Typed Spelling Input */
          <form onSubmit={handleSubmitTyped} className="space-y-4">
            <input
              type="text"
              autoFocus
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-700 text-cream font-mono text-lg focus:outline-none focus:border-primary transition-colors text-center"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="w-full py-4 rounded-xl bg-primary hover:bg-blue-600 disabled:bg-slate-800 disabled:text-cream/30 font-grotesk font-semibold text-white transition-colors"
            >
              Submit Answer
            </button>
          </form>
        )
      ) : (
        /* Answer Feedback Section */
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-5 border text-center ${
              selectedAnswer.toLowerCase() === vocab.word.toLowerCase()
                ? 'bg-neon/10 border-neon/30 text-neon'
                : 'bg-danger/10 border-danger/30 text-danger'
            }`}
          >
            <div className="text-xl mb-1">
              {selectedAnswer.toLowerCase() === vocab.word.toLowerCase()
                ? '🎉 Correct! Excellent job!'
                : '❌ Incorrect answer'}
            </div>
            {selectedAnswer.toLowerCase() !== vocab.word.toLowerCase() && (
              <p className="text-sm font-nunito text-cream/70">
                You said: <span className="font-mono text-danger font-semibold">{selectedAnswer || '(empty)'}</span>
              </p>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-2">
              Correct Answer
            </p>
            <p className="font-grotesk text-3xl font-bold text-cream capitalize mb-1">
              {vocab.word}
            </p>
            {vocab.phonetic && (
              <p className="font-mono text-sm text-primary mb-3">{vocab.phonetic}</p>
            )}
            <p className="font-nunito text-sm text-cream/60 italic leading-relaxed">
              "{vocab.exampleSentence}"
            </p>
          </div>

          <button
            onClick={() => onSubmit(null, null)} // Triggers next card
            className="w-full py-4 rounded-xl bg-primary hover:bg-blue-600 font-grotesk font-semibold text-white shadow-glow transition-all hover:scale-105"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
