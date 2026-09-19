import axiosClient from '../../../shared/api/axiosClient'

const unwrap = (response) => response.data?.data ?? response.data

const learningService = {
  async getWorlds(params = { activeOnly: true }) {
    const response = await axiosClient.get('/learning/worlds', { params })
    return unwrap(response)
  },

  async getScenarios(worldId) {
    const response = await axiosClient.get('/learning/scenarios', {
      params: worldId ? { worldId } : undefined,
    })
    return unwrap(response)
  },

  async getScenario(scenarioId) {
    const response = await axiosClient.get(`/learning/scenarios/${scenarioId}`)
    return unwrap(response)
  },

  async getScenarioSteps(scenarioId) {
    const response = await axiosClient.get('/learning/scenario-steps', {
      params: scenarioId ? { scenarioId } : undefined,
    })
    return unwrap(response)
  },

  async getScenarioVocabularies(scenarioId) {
    const response = await axiosClient.get('/learning/scenario-vocabularies', {
      params: scenarioId ? { scenarioId } : undefined,
    })
    return unwrap(response)
  },

  /**
   * Get world progress for a specific child + world combination.
   * Uses GET /progress/worlds?childId=... and filters by worldId client-side.
   */
  async getWorldProgressByChildAndWorldId(childId, worldId) {
    const response = await axiosClient.get('/progress/worlds', { params: { childId } })
    const list = unwrap(response) ?? []
    return list.find((p) => p.worldId === worldId || p.worldId === Number(worldId)) ?? null
  },

  async getScenarioProgressByChildId(childId) {
    const response = await axiosClient.get('/progress/scenarios', { params: { childId } })
    return unwrap(response)
  },
}

export default learningService
