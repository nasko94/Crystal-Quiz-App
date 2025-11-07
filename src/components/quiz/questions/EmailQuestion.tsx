'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

interface EmailQuestionProps {
  email: string
  onUpdate: (email: string) => void
  onNext: () => void
}

export default function EmailQuestion({ email, onUpdate, onNext }: EmailQuestionProps) {
  const [value, setValue] = useState(email)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = () => {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      setError('Моля, въведи имейл адрес')
      return
    }
    if (!validateEmail(trimmedValue)) {
      setError('Моля, въведи валиден имейл адрес')
      return
    }
    setError('')
    onUpdate(trimmedValue)
    onNext()
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <Mail className="w-12 h-12 md:w-16 md:h-16 text-purple-500" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          Кой е най-добрият ти имейл?
        </h2>

        <div className="max-w-md mx-auto">
          <input
            type="email"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="твоят@имейл.com"
            className={`input-field mb-2 ${error ? 'border-red-500' : ''}`}
            autoFocus
          />
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}

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

