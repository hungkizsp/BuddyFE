import axiosClient from '../../../shared/api/axiosClient'

const unwrap = (response) => response.data?.data ?? response.data

const progressService = {
  /**
   * Mark a scenario as completed and update all related progress records atomically.
   *
   * @param {object} params
   * @param {number} params.childId       - ID of the child profile
   * @param {number} params.scenarioId    - ID of the completed scenario
   * @param {number} params.score         - score achieved in this run (0 if not applicable)
   * @param {number[]} params.vocabularyIds - IDs of vocabulary words encountered during the scenario
   * @returns {Promise<{ alreadyCompleted: boolean, scenarioProgress: object, worldProgress: object }>}
   */
  async completeScenario({ childId, scenarioId, score = 0, vocabularyIds = [] }) {
    const response = await axiosClient.post('/progress/scenarios/complete', {
      childId,
      scenarioId,
      score,
      vocabularyIds,
    })
    return unwrap(response)
  },
}

export default progressService
