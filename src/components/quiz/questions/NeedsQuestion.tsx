'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, Shield, Heart } from 'lucide-react'

interface NeedsQuestionProps {
  needs: string
  onUpdate: (needs: string) => void
  onNext: () => void
}

const options = [
  { 
    value: 'time', 
    label: 'Повече Време и Свобода',
    icon: Clock,
  },
  { 
    value: 'money', 
    label: 'Повече Пари и Възможности',
    icon: DollarSign,
  },
  { 
    value: 'protection', 
    label: 'Повече Защита и Спокойствие',
    icon: Shield,
  },
  { 
    value: 'health', 
    label: 'Повече Здраве и Благополучие',
    icon: Heart,
  },
]

export default function NeedsQuestion({
  needs,
  onUpdate,
  onNext,
}: NeedsQuestionProps) {
  const [value, setValue] = useState(needs)

  const handleSelect = (option: string) => {
    setValue(option)
    onUpdate(option)
    setTimeout(() => {
      onNext()
    }, 500)
  }

  return (
    <div className="card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          От какво би казал, че имаш нужда сега?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(option.value)}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-300
                  ${value === option.value 
                    ? 'bg-gradient-primary text-white border-purple-600' 
                    : 'bg-white border-purple-200 hover:border-purple-400'
                  }
                `}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${value === option.value ? 'text-white' : 'text-purple-500'}`} />
                <span className="text-lg font-semibold">{option.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

