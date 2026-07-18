import axiosClient from '../../../shared/api/axiosClient';

const studyApi = {
  startSession: async (childId, categoryId, mode, vocabIds = null) => {
    const response = await axiosClient.post('/study-sessions/start', {
      childId,
      categoryId,
      mode,
      vocabIds,
    });
    return response.data?.data;
  },

  submitAnswer: async (sessionId, vocabularyId, isCorrect, responseTimeMs) => {
    const response = await axiosClient.post(`/study-sessions/${sessionId}/answer`, {
      vocabularyId,
      isCorrect,
      responseTimeMs,
    });
    return response.data?.data;
  },

  finishSession: async (sessionId) => {
    const response = await axiosClient.post(`/study-sessions/${sessionId}/finish`);
    return response.data?.data;
  },
};

export default studyApi;
