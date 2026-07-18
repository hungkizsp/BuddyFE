import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import useStudySession from '../hooks/useStudySession';
import StudyProgressBar from '../components/StudyProgressBar';
import FlashcardViewer from '../components/FlashcardViewer';
import StudyResult from '../components/StudyResult';
import { synthesizeSpeech } from '../../adventure/services/speechService';

export default function FlashcardModePage() {
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
  } = useStudySession(childId, categoryId, 'FLASHCARD');

  useEffect(() => {
    startSession();
  }, [startSession]);

  const handleSpeakFallback = async (text) => {
    try {
      await synthesizeSpeech(text);
    } catch (err) {
      console.warn('Azure TTS failed or not configured, falling back to browser SpeechSynthesis:', err);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleResponse = async (isCorrect) => {
    if (!currentVocab) return;
    
    // Submit answer to backend
    await submitAnswer(currentVocab.id, isCorrect, 0);

    // Navigate or complete
    const hasNext = nextWord();
    if (!hasNext) {
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
          <p className="font-mono text-sm uppercase tracking-wider text-cream/60">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream px-6">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-glass">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-grotesk text-xl font-bold mt-4 mb-2">Failed to load Flashcards</h2>
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
        <StudyResult results={results} modeName="Flashcards" onRetry={startSession} onReviewWeakWords={startSession} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col">
      {/* Header / progress */}
      <StudyProgressBar
        current={currentIndex + 1}
        total={vocabularies.length}
        modeName="Flashcards"
        onExit={handleExit}
      />

      {/* Main workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full">
        {currentVocab && (
          <div className="w-full flex flex-col gap-8">
            <FlashcardViewer
              vocab={currentVocab}
              childId={childId}
              onSpeak={handleSpeakFallback}
            />

            {/* Answer control buttons */}
            <div className="flex justify-center gap-6 max-w-xl mx-auto w-full select-none">
              <button
                onClick={() => handleResponse(false)}
                className="flex-1 py-4 rounded-2xl bg-danger/10 hover:bg-danger/20 border-2 border-danger/40 text-danger hover:border-danger hover:scale-[1.02] active:scale-[0.98] font-grotesk font-bold text-base transition-all flex flex-col items-center gap-1 shadow-soft"
              >
                <span>❌</span>
                <span>Review Again</span>
              </button>

              <button
                onClick={() => handleResponse(true)}
                className="flex-1 py-4 rounded-2xl bg-neon/10 hover:bg-neon/20 border-2 border-neon/40 text-neon hover:border-neon hover:scale-[1.02] active:scale-[0.98] font-grotesk font-bold text-base transition-all flex flex-col items-center gap-1 shadow-soft"
              >
                <span>✅</span>
                <span>Got It!</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
