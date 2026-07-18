import axiosClient from '../../../shared/api/axiosClient';

const highlightApi = {
  getHighlight: async (childId, vocabularyId) => {
    const response = await axiosClient.get('/highlights', {
      params: { childId, vocabularyId },
    });
    return response.data?.data;
  },

  saveHighlight: async (childId, vocabularyId, highlightData, userNote) => {
    const response = await axiosClient.put('/highlights', {
      childId,
      vocabularyId,
      highlightData,
      userNote,
    });
    return response.data?.data;
  },
};

export default highlightApi;
