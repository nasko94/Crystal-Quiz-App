'use client'

import { motion } from 'framer-motion'
import { QuizData } from '@/types/quiz'
import ProductCard from './ProductCard'

interface AIRecommendationProps {
  quizData: QuizData
  onContinue: () => void
}

// Mock продукти - ще се заменят с истински от AI
const mockProducts = [
  {
    id: '1',
    name: 'Зелен Авантюрин',
    image: '/products/aventurine.jpg',
    price: 45.00,
    description: 'Кристалът на възможностите и просперитета. Привлича късмет и отваря нови врати.',
  },
  {
    id: '2',
    name: 'Розов Кварц',
    image: '/products/rose-quartz.jpg',
    price: 38.00,
    description: 'Камъкът на любовта и хармонията. Носи спокойствие и емоционален баланс.',
  },
  {
    id: '3',
    name: 'Аметист',
    image: '/products/amethyst.jpg',
    price: 52.00,
    description: 'Кристалът на духовността и защитата. Помага за медитация и вътрешен мир.',
  },
]

export default function AIRecommendation({
  quizData,
  onContinue,
}: AIRecommendationProps) {
  // TODO: Тук ще се прави реалното AI извикване
  const getPersonalizedMessage = () => {
    return `Според нашият анализ ти търсиш баланс и хармония в живота си. 
    Усещаш се готов за промяна и искаш да привлечеш повече позитивна енергия. 
    Имаш силна интуиция и желание за личностно развитие.`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-full text-xl font-bold mb-4">
          ✨ Твоите резултати са готови, {quizData.name}! ✨
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-secondary p-6 rounded-2xl mb-8"
      >
        <p className="text-lg text-gray-700 leading-relaxed text-center">
          {getPersonalizedMessage()}
        </p>
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Точно затова ние смятаме, че за теб най-подходящи в този момент са:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mockProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.2 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <p className="text-xl text-gray-700 mb-6">
          Какво мислиш? Допадат ли ти и искаш ли да ти ги приготвя още сега?
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="btn-primary text-xl"
        >
          Започни разговор с AI
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

