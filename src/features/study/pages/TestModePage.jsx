import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import useStudySession from '../hooks/useStudySession';
import StudyProgressBar from '../components/StudyProgressBar';
import StudyResult from '../components/StudyResult';

const TIME_LIMIT_SECONDS = 15;

export default function TestModePage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { childProfile } = useAuthStore();
  const childId = childProfile?.id;

  const {
    loading,
    error,
    vocabularies,
    currentIndex,
    currentVocab,
    results,
    isFinished,
    startSession,
    submitAnswer,
    nextWord,
    finishSession,
  } = useStudySession(childId, categoryId, 'TEST');

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    startSession();
  }, [startSession]);

  // Handle countdown timer per question
  useEffect(() => {
    if (!currentVocab || isFinished) return;
    
    // Reset timer
    setTimeLeft(TIME_LIMIT_SECONDS);

    // Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentVocab, isFinished]);

  // Generate choices
  const choices = useMemo(() => {
    if (!currentVocab || vocabularies.length === 0) return [];
    const correctWord = currentVocab.word;
    const others = vocabularies
      .map((v) => v.word)
      .filter((w) => w.toLowerCase() !== correctWord.toLowerCase());
    
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);
    selectedOthers.push(correctWord);

    return selectedOthers.sort(() => 0.5 - Math.random());
  }, [currentVocab, vocabularies]);

  const handleTimeOut = async () => {
    if (!currentVocab) return;
    // Mark as wrong, response time is max time
    await submitAnswer(currentVocab.id, false, TIME_LIMIT_SECONDS * 1000);
    goToNextQuestion();
  };

  const handleSelectAnswer = async (choice) => {
    if (!currentVocab) return;

    const isCorrect = choice.toLowerCase() === currentVocab.word.toLowerCase();
    const responseTime = (TIME_LIMIT_SECONDS - timeLeft) * 1000;
    
    await submitAnswer(currentVocab.id, isCorrect, responseTime);
    goToNextQuestion();
  };

  const goToNextQuestion = async () => {
    const hasNext = nextWord();
    if (!hasNext) {
      if (timerRef.current) clearInterval(timerRef.current);
      await finishSession();
    }
  };

  const handleExit = () => {
    navigate('/study');
  };

  if (loading && vocabularies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm uppercase tracking-wider text-cream/40">Preparing Exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream px-6">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-glass">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-grotesk text-xl font-bold mt-4 mb-2">Failed to start Test mode</h2>
          <p className="text-sm text-cream/60 font-nunito mb-6">{error}</p>
          <button
            onClick={() => navigate('/study')}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 font-grotesk font-semibold text-white transition-all shadow-glow"
          >
            Back to Study Hub
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-navy text-cream py-12 px-6">
        <StudyResult results={results} modeName="Test" onRetry={startSession} onReviewWeakWords={startSession} />
      </div>
    );
  }

  const timerColor = timeLeft > 5 ? 'text-accent' : 'text-danger animate-pulse';

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col">
      <StudyProgressBar
        current={currentIndex}
        total={vocabularies.length}
        modeName="Test"
        onExit={handleExit}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {currentVocab && (
          <div className="w-full max-w-xl space-y-6">
            {/* Timer and Indicator */}
            <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 shadow-soft">
              <span className="font-mono text-xs uppercase tracking-widest text-cream/40">
                Exam Mode — Answer Quickly
              </span>
              <div className={`font-mono font-bold text-lg flex items-center gap-1.5 ${timerColor}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>

            {/* Test Question Card */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-glass text-center animate-slide-up">
              <span className="font-mono text-xs text-cream/30 uppercase tracking-widest block mb-4">
                Question {currentIndex + 1} of {vocabularies.length}
              </span>

              {currentVocab.imageUrl && (
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 mx-auto mb-4 border border-slate-700">
                  <img src={currentVocab.imageUrl} alt="hint" className="w-full h-full object-cover" />
                </div>
              )}

              <h2 className="font-grotesk text-3xl font-bold text-cream mb-2">
                {currentVocab.meaning}
              </h2>
              {currentVocab.exampleSentence && (
                <p className="font-nunito text-sm text-cream/40 italic">
                  "{currentVocab.exampleSentence.replace(new RegExp(currentVocab.word, 'gi'), '_____')}"
                </p>
              )}

              {/* Multiple choices */}
              <div className="grid grid-cols-1 gap-3 mt-8">
                {choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(choice)}
                    className="w-full text-left px-5 py-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 hover:border-primary/50 text-cream font-grotesk font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <span className="inline-block w-6 text-primary">{i + 1}.</span>
                    <span className="capitalize">{choice}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
