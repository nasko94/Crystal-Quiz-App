'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NameQuestionProps {
  name: string
  onUpdate: (name: string) => void
  onNext: () => void
}

export default function NameQuestion({ name, onUpdate, onNext }: NameQuestionProps) {
  const [value, setValue] = useState(name)

  const handleSubmit = () => {
    if (value.trim()) {
      onUpdate(value.trim())
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
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Как можем да те наричаме?
        </h2>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Твоето име..."
            className="input-field mb-6"
            autoFocus
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Продължи
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

