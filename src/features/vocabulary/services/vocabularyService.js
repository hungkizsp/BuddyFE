import axiosClient from '../../../shared/api/axiosClient'

/**
 * Vocabulary API service.
 * Talks to the Spring Boot backend endpoints.
 */
const vocabularyService = {
  /** GET /api/vocabularies — all vocabulary words, optionally filtered by category */
  getAll: async (categoryId = null) => {
    const params = categoryId ? { categoryId } : {}
    const res = await axiosClient.get('/vocabularies', { params })
    return res.data?.data || []
  },

  /** GET /api/vocabularies/:id — single vocabulary detail */
  getById: async (id) => {
    const res = await axiosClient.get(`/vocabularies/${id}`)
    return res.data?.data || null
  },

  /** GET /api/progress/vocabularies?childId=... — child's learning progress */
  getProgress: async (childId) => {
    const res = await axiosClient.get('/progress/vocabularies', { params: { childId } })
    return res.data?.data || []
  },
}

export default vocabularyService
