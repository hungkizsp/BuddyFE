import { useState, useCallback, useRef } from 'react'
import { generateCharacter, getCharacterTaskStatus } from '../../../shared/api/characterApi'

const POLL_INTERVAL_MS = 8000 // Poll every 8 seconds

/**
 * Custom hook to manage the full character generation lifecycle:
 * 1. Submit generation request
 * 2. Poll until SUCCEEDED or FAILED
 * 3. Return the final model path
 */
export function useCharacterGeneration() {
  const [task, setTask] = useState(null)        // Current task data
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const pollTimerRef = useRef(null)

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  const startPolling = useCallback((characterId) => {
    stopPolling()
    pollTimerRef.current = setInterval(async () => {
      try {
        const updated = await getCharacterTaskStatus(characterId)
        setTask(updated)

        if (updated.status === 'SUCCEEDED' || updated.status === 'FAILED') {
          stopPolling()
          setIsGenerating(false)
          if (updated.status === 'FAILED') {
            setError('Character generation failed. Please try again with a different prompt.')
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
        stopPolling()
        setIsGenerating(false)
        setError('Lost connection while tracking generation. Please refresh and check your characters.')
      }
    }, POLL_INTERVAL_MS)
  }, [stopPolling])

  const generate = useCallback(async (prompt, artStyle, characterName) => {
    try {
      setError(null)
      setIsGenerating(true)
      setTask(null)

      const initialTask = await generateCharacter(prompt, artStyle, characterName)
      setTask(initialTask)

      // Start polling with the DB id
      startPolling(initialTask.id)
    } catch (err) {
      setError(err.message || 'Failed to submit generation request')
      setIsGenerating(false)
    }
  }, [startPolling])

  const reset = useCallback(() => {
    stopPolling()
    setTask(null)
    setError(null)
    setIsGenerating(false)
  }, [stopPolling])

  return {
    task,
    isGenerating,
    error,
    generate,
    reset,
  }
}
