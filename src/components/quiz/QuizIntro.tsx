'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface QuizIntroProps {
  onStart: () => void
}

export default function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card text-center max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="inline-block mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
        Кристален Тест
      </h1>
      
      <p className="text-xl text-gray-700 mb-8 leading-relaxed">
        Здравей приятелю! В този Кристален Тест ще ти помогнем да намериш 
        точният кристал за своите нужди.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="btn-primary text-xl"
      >
        Да започваме!
      </motion.button>
    </motion.div>
  )
}

