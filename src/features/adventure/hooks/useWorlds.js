import { useEffect, useState } from 'react'
import learningService from '../services/learningService'

export default function useWorlds() {
  const [worlds, setWorlds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    const loadWorlds = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await learningService.getWorlds()
        if (!ignore) setWorlds(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load worlds.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadWorlds()

    return () => {
      ignore = true
    }
  }, [])

  return { worlds, loading, error }
}
