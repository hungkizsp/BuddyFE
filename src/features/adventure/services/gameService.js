import * as api from '../api/learningApi'

export async function loadKitchenScenario(id){

    const scenario=await api.getScenario(id)

    const steps=await api.getScenarioSteps(id)

    const vocabulary=await api.getScenarioVocabulary(id)

    return{

        scenario:scenario.data.data,

        steps:steps.data.data,

        vocabulary:vocabulary.data.data

    }

}