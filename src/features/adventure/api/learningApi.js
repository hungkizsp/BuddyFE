import axiosClient from '../../../shared/api/axiosClient'

export const getScenario = (id) =>
    axiosClient.get(`/learning/scenarios/${id}`)

export const getScenarioSteps = (scenarioId) =>
    axiosClient.get(`/learning/scenario-steps`,{
        params:{
            scenarioId
        }
    })

export const getScenarioVocabulary = (scenarioId)=>
    axiosClient.get(`/learning/scenario-vocabularies`,{
        params:{
            scenarioId
        }
    })