import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import useStudySession from '../hooks/useStudySession';
import StudyProgressBar from '../components/StudyProgressBar';
import LearnQuestion from '../components/LearnQuestion';
import StudyResult from '../components/StudyResult';

export default function LearnModePage() {
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
  } = useStudySession(childId, categoryId, 'LEARN');

  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(0);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    setIsAnswered(false);
    setSelectedAnswer('');
    setSessionStartTime(Date.now());
  }, [currentVocab]);

  // Generate multiple choice answers based on category vocabulary
  const choices = useMemo(() => {
    if (!currentVocab || vocabularies.length === 0) return [];
    const correctWord = currentVocab.word;
    const others = vocabularies
      .map((v) => v.word)
      .filter((w) => w.toLowerCase() !== correctWord.toLowerCase());
    
    // Shuffle and pick 3 other words
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);
    selectedOthers.push(correctWord);

    // Shuffle final 4 options
    return selectedOthers.sort(() => 0.5 - Math.random());
  }, [currentVocab, vocabularies]);

  const handleSubmitAnswer = async (isCorrect, answer) => {
    // If isAnswered is true, then this is the "Continue" click
    if (isAnswered) {
      const hasNext = nextWord();
      if (!hasNext) {
        await finishSession();
      }
      return;
    }

    // Submit user answer
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const responseTime = Date.now() - sessionStartTime;
    await submitAnswer(currentVocab.id, isCorrect, responseTime);
  };

  const handleExit = () => {
    navigate('/study');
  };

  if (loading && vocabularies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm uppercase tracking-wider text-cream/40">Starting Learn Session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream px-6">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-glass">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-grotesk text-xl font-bold mt-4 mb-2">Failed to start Learn mode</h2>
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
        <StudyResult results={results} modeName="Learn" onRetry={startSession} onReviewWeakWords={startSession} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col">
      <StudyProgressBar
        current={currentIndex + (isAnswered ? 1 : 0)}
        total={vocabularies.length}
        modeName="Learn"
        onExit={handleExit}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {currentVocab && (
          <LearnQuestion
            vocab={currentVocab}
            choices={choices}
            isAnswered={isAnswered}
            correctAnswer={currentVocab.word}
            selectedAnswer={selectedAnswer}
            onSubmit={handleSubmitAnswer}
          />
        )}
      </main>
    </div>
  );
}
