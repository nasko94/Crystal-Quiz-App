'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CustomDatePicker from '@/components/ui/CustomDatePicker'
import { getZodiacSign } from '@/utils/zodiac'

interface BirthdateQuestionProps {
  name: string
  dateOfBirth: string
  onUpdate: (dateOfBirth: string, zodiacSign: string) => void
  onNext: () => void
}

export default function BirthdateQuestion({
  name,
  dateOfBirth,
  onUpdate,
  onNext,
}: BirthdateQuestionProps) {
  const [value, setValue] = useState(dateOfBirth)

  const handleSubmit = () => {
    if (value) {
      const zodiac = getZodiacSign(value)
      onUpdate(value, zodiac)
      onNext()
    }
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800">
          Чудесно име, {name}!
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 text-center">
          Нека да започнем анализа от основите. Каква е твоята рожденна дата?
        </p>

        <div className="max-w-2xl mx-auto">
          <CustomDatePicker
            value={value}
            onChange={setValue}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!value}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            Продължи
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

