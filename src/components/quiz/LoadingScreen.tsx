'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { QuizData, AIRecommendationData } from '@/types/quiz'
import { getNeedsLabel, getAchievementLabel, getHappinessLabel } from '@/utils/zodiac'

interface LoadingScreenProps {
  name: string
  quizData: QuizData
  onComplete: (data: AIRecommendationData) => void
}

export default function LoadingScreen({ name, quizData, onComplete }: LoadingScreenProps) {
  const [error, setError] = useState<string | null>(null)
  const hasCalledOnCompleteRef = useRef(false)

  useEffect(() => {
    // Ако вече е извикано onComplete, не правим нищо
    if (hasCalledOnCompleteRef.current) {
      console.log('⏭️ onComplete already called, skipping')
      return
    }

    const fetchRecommendation = async () => {
      try {
        // Подготвяме данните за API заявката
        const answers = {
          name: quizData.name,
          dateOfBirth: quizData.dateOfBirth,
          zodiacSign: quizData.zodiacSign,
          happinessLevel: quizData.happinessLevel,
          happinessLabel: getHappinessLabel(quizData.happinessLevel),
          lastAchievement: getAchievementLabel(quizData.lastAchievement),
          needs: getNeedsLabel(quizData.needs),
          obstacles: quizData.obstacles.trim() || '',
        }

        const response = await fetch('https://api.flow-fast.ai/crystal-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AIRecommendationData = await response.json()

        // Логваме целия server response
        console.log('📥 Server Response:', JSON.stringify(data, null, 2))

        if (data.success && data.fullProductData && Array.isArray(data.fullProductData)) {
          // Проверяваме дали вече е извикано
          if (hasCalledOnCompleteRef.current) {
            console.warn('⚠️ onComplete already called, skipping')
            return
          }
          console.log('✅ Data is valid, calling onComplete')
          hasCalledOnCompleteRef.current = true
          onComplete(data)
        } else {
          console.error('❌ Invalid response format:', data)
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err)
        setError(err instanceof Error ? err.message : 'Грешка при зареждане на препоръките')
      }
    }

    fetchRecommendation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center max-w-2xl mx-auto"
      >
        <div className="text-red-500 mb-4">
          <h2 className="text-2xl font-bold mb-2">Грешка</h2>
          <p>{error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card text-center max-w-2xl mx-auto"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="inline-block mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
        Анализираме твоите отговори...
      </h2>

      <p className="text-xl text-gray-600 mb-8">
        Моля изчакай, {name}, докато нашият кристален консултант подготвя персонализираните препоръки за теб
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-gradient-primary rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

