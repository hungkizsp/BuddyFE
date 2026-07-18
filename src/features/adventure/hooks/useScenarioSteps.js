import { useEffect, useMemo, useState } from 'react'
import learningService from '../services/learningService'

export default function useScenarioSteps(scenarioId) {
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scenarioId) return undefined

    let ignore = false

    const loadSteps = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await learningService.getScenarioSteps(scenarioId)
        if (!ignore) setSteps(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load scenario steps.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadSteps()

    return () => {
      ignore = true
    }
  }, [scenarioId])

  const orderedSteps = useMemo(
    () => [...(scenarioId ? steps : [])].sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0)),
    [scenarioId, steps],
  )

  return { steps: orderedSteps, loading, error }
}
