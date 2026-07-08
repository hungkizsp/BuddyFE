import { useEffect, useState } from 'react'
import learningService from '../services/learningService'

export default function useWorldProgress(worldId) {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!worldId) {
      setProgress(null)
      return
    }

    let ignore = false

    const loadProgress = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await learningService.getWorldProgressById(worldId)
        if (!ignore) setProgress(data ?? null)
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load progress.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProgress()

    return () => {
      ignore = true
    }
  }, [worldId])

  return { progress, loading, error }
}
