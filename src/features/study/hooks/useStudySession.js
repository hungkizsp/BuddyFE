import { useState, useCallback } from 'react';
import studyApi from '../services/studyApi';

export default function useStudySession(childId, categoryId, mode) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const startSession = useCallback(async (vocabIds = null) => {
    if (!childId || !categoryId || !mode) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setIsFinished(false);
    setCurrentIndex(0);
    try {
      const data = await studyApi.startSession(childId, categoryId, mode, vocabIds);
      setSessionId(data.sessionId);
      setVocabularies(data.vocabularies || []);
    } catch (err) {
      console.error('Failed to start study session:', err);
      setError(err.message || 'Failed to start study session');
    } finally {
      setLoading(false);
    }
  }, [childId, categoryId, mode]);

  const submitAnswer = useCallback(async (vocabularyId, isCorrect, responseTimeMs = 0) => {
    if (!sessionId) return;
    try {
      await studyApi.submitAnswer(sessionId, vocabularyId, isCorrect, responseTimeMs);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  }, [sessionId]);

  const nextWord = useCallback(() => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    } else {
      return false; // No more words
    }
  }, [currentIndex, vocabularies.length]);

  const finishSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const data = await studyApi.finishSession(sessionId);
      setResults(data);
      setIsFinished(true);
    } catch (err) {
      console.error('Failed to finish study session:', err);
      setError(err.message || 'Failed to finish study session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return {
    loading,
    error,
    sessionId,
    vocabularies,
    currentIndex,
    currentVocab: vocabularies[currentIndex] || null,
    results,
    isFinished,
    startSession,
    submitAnswer,
    nextWord,
    finishSession,
  };
}
