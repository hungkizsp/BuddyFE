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
}

export default learningService
