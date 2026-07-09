import { useState, useEffect, useCallback } from 'react'
import vocabularyService from '../services/vocabularyService'

const GALLERY_MAP = {
  'apple': '/gallery/apple.avif',
  'apple pie': '/gallery/apple.avif',
  'apple juice': '/gallery/apple.avif',
  'banana': '/gallery/Banana.png',
  'beef': '/gallery/Beef.jpg',
  'beef steak': '/gallery/Beef.jpg',
  'bread': '/gallery/Bread.png',
  'garlic bread': '/gallery/Bread.png',
  'broccoli': '/gallery/Broccoli.png',
  'broccoli soup': '/gallery/Broccoli.png',
  'butter': '/gallery/Butter.png',
  'candy': '/gallery/Candy.avif',
  'cheese': '/gallery/Cheese.webp',
  'cheesecake': '/gallery/Cheese.webp',
  'chicken': '/gallery/Chicken meat.jpg',
  'grilled chicken': '/gallery/Chicken meat.jpg',
  'chicken meat': '/gallery/Chicken meat.jpg',
  'chocolate': '/gallery/Chocolate.jpg',
  'chocolate cake': '/gallery/Chocolate.jpg',
  'crab': '/gallery/Crab.jpg',
  'crackers': '/gallery/Crackers.jpg',
  'cucumber': '/gallery/Cucumber.jpg',
  'egg on toast': '/gallery/Egg on Toast.png',
  'egg': '/gallery/Egg.jpg',
  'fish': '/gallery/Fish.avif',
  'grapes': '/gallery/Grapes.png',
  'milk': '/gallery/Milk.jpg',
  'milkshake': '/gallery/Milk.jpg',
  'onion': '/gallery/Onion.jpg',
  'pear': '/gallery/Pear.jpg',
  'pork': '/gallery/Pork.jpg',
  'pork chop': '/gallery/Pork.jpg',
  'potato': '/gallery/Potato.webp',
  'mashed potatoes': '/gallery/Potato.webp',
  'shrimp': '/gallery/Shrimp.jpg',
  'watermelon': '/gallery/Watermelon.png',
  'yogurt': '/gallery/Yogurt.webp',
  'orange': '/gallery/orange.png',
  'orange juice': '/gallery/orange.png',
  'bird': '/gallery/bird.avif',
  'cat': '/gallery/cat.jpg',
  'dog': '/gallery/dog.jpg',
  'happy': '/gallery/happy.png',
  'hospital': '/gallery/hospital.png',
  'sad': '/gallery/sad.webp',
  'school': '/gallery/school.avif',
}

const VIETNAMESE_MEANINGS = {
  'apple': 'Quả táo',
  'banana': 'Quả chuối',
  'water': 'Nước uống',
  'dog': 'Con chó',
  'cat': 'Con mèo',
  'bird': 'Con chim',
  'happy': 'Vui vẻ',
  'sad': 'Buồn bã',
  'school': 'Trường học',
  'hospital': 'Bệnh viện'
}

function getGalleryImage(word) {
  if (!word) return null
  const cleaned = word.toLowerCase().trim()
  
  if (GALLERY_MAP[cleaned]) {
    return GALLERY_MAP[cleaned]
  }

  const keys = Object.keys(GALLERY_MAP)
  for (const key of keys) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return GALLERY_MAP[key]
    }
  }

  return null
}

function getVietnameseMeaning(word, originalMeaning) {
  if (!word) return originalMeaning
  const cleaned = word.toLowerCase().trim()
  return VIETNAMESE_MEANINGS[cleaned] || originalMeaning
}

/**
 * useVocabulary – Fetches all vocabulary words and merges with child progress.
 * Returns enriched list with learning status for each word.
 */
export default function useVocabulary(childId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch vocabulary list and progress in parallel
      const [vocabList, progressList] = await Promise.all([
        vocabularyService.getAll(),
        childId ? vocabularyService.getProgress(childId) : Promise.resolve([]),
      ])

      // Build a map of vocabularyId -> progress
      const progressMap = {}
      progressList.forEach((p) => {
        progressMap[p.vocabularyId] = p
      })

      // Merge: enrich each vocabulary word with its progress data
      const enriched = vocabList.map((vocab) => {
        const progress = progressMap[vocab.id]
        const galleryImg = getGalleryImage(vocab.word)
        return {
          ...vocab,
          imageUrl: galleryImg || vocab.imageUrl,
          meaning: getVietnameseMeaning(vocab.word, vocab.meaning),
          isLearned: !!progress,
          masteryLevel: progress?.masteryLevel ?? 0,
          correctCount: progress?.correctCount ?? 0,
          wrongCount: progress?.wrongCount ?? 0,
          confidenceScore: progress?.confidenceScore ?? 0,
          lastPracticed: progress?.lastPracticed ?? null,
        }
      })

      setData(enriched)
    } catch (err) {
      console.error('Failed to fetch vocabulary:', err)
      setError(err.message || 'Failed to load vocabulary')
    } finally {
      setLoading(false)
    }
  }, [childId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh: fetchData }
}
