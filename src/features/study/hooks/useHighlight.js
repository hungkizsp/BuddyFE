import { useState, useEffect, useCallback } from 'react';
import highlightApi from '../services/highlightApi';

export default function useHighlight(childId, vocabularyId) {
  const [highlights, setHighlights] = useState([]);
  const [userNote, setUserNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHighlight = useCallback(async () => {
    if (!childId || !vocabularyId) return;
    setLoading(true);
    try {
      const data = await highlightApi.getHighlight(childId, vocabularyId);
      if (data) {
        setHighlights(data.highlightData ? JSON.parse(data.highlightData) : []);
        setUserNote(data.userNote || '');
      } else {
        setHighlights([]);
        setUserNote('');
      }
    } catch (err) {
      console.error('Failed to load highlights:', err);
    } finally {
      setLoading(false);
    }
  }, [childId, vocabularyId]);

  useEffect(() => {
    fetchHighlight();
  }, [fetchHighlight]);

  const saveHighlight = useCallback(async (newHighlights, newNote) => {
    if (!childId || !vocabularyId) return;
    const highlightStr = JSON.stringify(newHighlights);
    try {
      const data = await highlightApi.saveHighlight(childId, vocabularyId, highlightStr, newNote !== undefined ? newNote : userNote);
      if (data) {
        setHighlights(data.highlightData ? JSON.parse(data.highlightData) : []);
        if (newNote !== undefined) setUserNote(newNote);
      }
    } catch (err) {
      console.error('Failed to save highlights:', err);
    }
  }, [childId, vocabularyId, userNote]);

  return {
    highlights,
    userNote,
    loading,
    saveHighlight,
    refreshHighlight: fetchHighlight,
  };
}
