'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Waves, Footprints, Wind } from 'lucide-react'

interface BeachQuestionProps {
  beachAction: string
  onUpdate: (beachAction: string) => void
  onNext: () => void
}

const options = [
  { 
    value: 'photo', 
    label: 'Правя една снимка',
    icon: Camera,
  },
  { 
    value: 'dive', 
    label: 'Хвърлям се направо във водата!',
    icon: Waves,
  },
  { 
    value: 'feel', 
    label: 'Усещам пясъка и водата с пръстите на краката си',
    icon: Footprints,
  },
  { 
    value: 'breathe', 
    label: 'Сядам и поемам дълбок дъх',
    icon: Wind,
  },
]

export default function BeachQuestion({
  beachAction,
  onUpdate,
  onNext,
}: BeachQuestionProps) {
  const handleSelect = (option: string) => {
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
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          Представи си че откриваш скрит плаж. Какво е първото нещо което ще направиш?
        </h2>

        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(option.value)}
                className="p-4 md:p-6 rounded-xl md:rounded-2xl border-2 bg-white border-purple-200 hover:border-purple-400 transition-all duration-300"
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-purple-500" />
                <span className="text-sm md:text-lg font-semibold leading-tight">{option.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

