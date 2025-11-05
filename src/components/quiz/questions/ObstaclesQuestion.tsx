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
  const [showFinal, setShowFinal] = useState(false)

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
    setShowFinal(true)
    setTimeout(() => {
      onNext()
    }, 3000)
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!showFinal ? (
          <>
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
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="bg-gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Чудесно!
            </h2>
            <p className="text-xl text-gray-700">
              Вече имаме цялата ни нужда информация за да изготвим твоята 
              персонализирана препоръка за личен кристал!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

