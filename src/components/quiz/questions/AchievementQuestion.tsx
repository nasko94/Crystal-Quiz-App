'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AchievementQuestionProps {
  lastAchievement: string
  happinessLevel: number
  onUpdate: (achievement: string) => void
  onNext: () => void
}

const getHappinessComment = (level: number): string => {
  if (level <= 4) {
    return 'Съжалявам да го чуя! Нека го подобрим!'
  }
  if (level <= 7) {
    return `${level} е добре, но можем да го подобрим!`
  }
  return `${level}? Ти си супер!`
}

const options = [
  { value: 'recent', label: 'Съвсем наскоро' },
  { value: '1year', label: 'Преди година' },
  { value: '3years', label: 'Преди 3 години' },
  { value: '5years', label: 'Преди 5 години' },
]

export default function AchievementQuestion({
  lastAchievement,
  happinessLevel,
  onUpdate,
  onNext,
}: AchievementQuestionProps) {
  const [value, setValue] = useState(lastAchievement)

  const handleSelect = (option: string) => {
    setValue(option)
    onUpdate(option)
    onNext()
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
          {getHappinessComment(happinessLevel)}
        </h2>

        <p className="text-xl text-gray-600 mb-8 text-center">
          Кога за последно направи нещо значимо?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option.value)}
              className="btn-secondary text-lg py-6"
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

