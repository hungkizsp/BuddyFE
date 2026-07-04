import { useEffect, useState } from 'react'
import learningService from '../services/learningService'

export default function useScenarios(worldId) {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!worldId) {
      return undefined
    }

    let ignore = false

    const loadScenarios = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await learningService.getScenarios(worldId)
        if (!ignore) setScenarios(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load scenarios.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadScenarios()

    return () => {
      ignore = true
    }
  }, [worldId])

  return { scenarios: worldId ? scenarios : [], loading, error }
}
