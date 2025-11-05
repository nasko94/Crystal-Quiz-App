'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizData } from '@/types/quiz'
import { getNeedsLabel, getAchievementLabel, getHappinessLabel } from '@/utils/zodiac'

interface ObstaclesQuestionProps {
  obstacles: string
  quizData: QuizData
  onUpdate: (obstacles: string) => void
  onNext: () => void
}

export default function ObstaclesQuestion({
  obstacles,
  quizData,
  onUpdate,
  onNext,
}: ObstaclesQuestionProps) {
  const [value, setValue] = useState(obstacles)

  const handleSubmit = () => {
    // Подготвяме данните за AI с четими етикети вместо ключове
    const finalData = {
      name: quizData.name,
      dateOfBirth: quizData.dateOfBirth,
      zodiacSign: quizData.zodiacSign,
      happinessLevel: quizData.happinessLevel,
      happinessLabel: getHappinessLabel(quizData.happinessLevel),
      lastAchievement: getAchievementLabel(quizData.lastAchievement),
      needs: getNeedsLabel(quizData.needs),
      obstacles: value.trim() || '',
    }
    
    // Логваме всички данни като JSON за AI
    console.log('📊 Quiz Data for AI:', JSON.stringify(finalData, null, 2))
    
    onUpdate(value.trim() || '')
    onNext()
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-800">
          И накрая, има ли нещо, което да те притеснява напоследък?
        </h2>

        <div className="max-w-2xl mx-auto">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Сподели това, което те притеснява..."
            className="input-field min-h-[200px] mb-2 resize-none"
            autoFocus
          />

          <p className="text-sm text-gray-500 mb-1 text-center">
            (По желание - не е задължително)
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="btn-primary w-full mt-6"
          >
            Завърши анализа
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}


