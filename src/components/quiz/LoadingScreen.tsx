'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  name: string
  onComplete: () => void
}

export default function LoadingScreen({ name, onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Симулираме AI processing
    const timer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card text-center max-w-2xl mx-auto"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="inline-block mb-6"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
        Анализираме твоите отговори...
      </h2>

      <p className="text-xl text-gray-600 mb-8">
        Моля изчакай, {name}, докато нашият AI подготвя персонализираните препоръки за теб
      </p>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="inline-block"
      >
        <Loader2 className="w-12 h-12 text-purple-500" />
      </motion.div>

      <div className="mt-8 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-gradient-primary rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

