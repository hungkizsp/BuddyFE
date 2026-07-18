import { useEffect, useState } from 'react'
import learningService from '../services/learningService'

export default function useScenarioVocabulary(scenarioId) {
  const [vocabularies, setVocabularies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scenarioId) {
      return undefined
    }

    let ignore = false

    const loadVocabulary = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await learningService.getScenarioVocabularies(scenarioId)
        if (!ignore) setVocabularies(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load scenario vocabulary.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadVocabulary()

    return () => {
      ignore = true
    }
  }, [scenarioId])

  return { vocabularies: scenarioId ? vocabularies : [], loading, error }
}
