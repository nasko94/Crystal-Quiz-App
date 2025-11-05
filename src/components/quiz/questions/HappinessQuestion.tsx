'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface HappinessQuestionProps {
  name: string
  zodiacSign: string
  happinessLevel: number
  onUpdate: (level: number) => void
  onNext: () => void
}

const getEmotionalState = (level: number): { emoji: string; text: string; color: string } => {
  const states: Record<number, { emoji: string; text: string; color: string }> = {
    0: { emoji: '😢', text: 'Много нещастен', color: 'text-red-500' },
    1: { emoji: '😔', text: 'Нещастен', color: 'text-red-400' },
    2: { emoji: '😞', text: 'Тъжен', color: 'text-orange-500' },
    3: { emoji: '😕', text: 'Разстроен', color: 'text-orange-400' },
    4: { emoji: '😐', text: 'Неутрален', color: 'text-yellow-500' },
    5: { emoji: '🙂', text: 'Добре', color: 'text-yellow-400' },
    6: { emoji: '😊', text: 'Доволен', color: 'text-green-400' },
    7: { emoji: '😄', text: 'Щастлив', color: 'text-green-500' },
    8: { emoji: '😁', text: 'Много щастлив', color: 'text-purple-400' },
    9: { emoji: '🤩', text: 'Еуфоричен', color: 'text-purple-500' },
    10: { emoji: '✨', text: 'Нирвана', color: 'text-gradient' },
  }
  return states[level]
}

export default function HappinessQuestion({
  name,
  zodiacSign,
  happinessLevel,
  onUpdate,
  onNext,
}: HappinessQuestionProps) {
  const [value, setValue] = useState(happinessLevel)

  const handleSubmit = () => {
    onUpdate(value)
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
          Ooo, значи си {zodiacSign}. Супер!
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 text-center">
          От 0-10, какво е емоционалното ти състояние напоследък?
        </p>

        <div className="max-w-2xl mx-auto">
          {/* Emotional State Display */}
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-center mb-6"
          >
            <div className="text-6xl mb-3">{getEmotionalState(value).emoji}</div>
            <p className={`text-2xl font-bold ${getEmotionalState(value).color}`}>
              {getEmotionalState(value).text}
            </p>
          </motion.div>

          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="10"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-primary rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF69B4 0%, #9B59B6 ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
              }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>0</span>
            <span className="text-xl font-bold text-gray-800">{value}</span>
            <span>10</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            Продължи
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

