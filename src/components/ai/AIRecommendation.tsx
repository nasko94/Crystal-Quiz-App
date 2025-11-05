'use client'

import { motion } from 'framer-motion'
import { QuizData, AIRecommendationData, Product } from '@/types/quiz'
import ProductCard from './ProductCard'

interface AIRecommendationProps {
  quizData: QuizData
  recommendationData: AIRecommendationData
  onContinue: () => void
}

export default function AIRecommendation({
  quizData,
  recommendationData,
  onContinue,
}: AIRecommendationProps) {
  console.log('🎨 AIRecommendation rendered with:', recommendationData)
  
  // Safety check - ако няма данни, показваме съобщение
  if (!recommendationData || !recommendationData.fullProductData || recommendationData.fullProductData.length === 0) {
    console.warn('⚠️ No recommendation data available')
    return (
      <div className="card text-center">
        <p>Зареждане на препоръките...</p>
      </div>
    )
  }

  // Мапваме productIds към реалните продукти чрез legacyId
  let productsToShow: Product[] = (recommendationData.productIds || [])
    .map(productId => {
      // Конвертираме productId в string за сравнение
      const searchId = String(productId)
      return recommendationData.fullProductData.find(
        product => String(product.legacyId) === searchId || String(product.id) === searchId
      )
    })
    .filter((product): product is Product => product !== undefined)
  
  // Ако няма мапнати продукти, показваме първите 3 като fallback
  if (productsToShow.length === 0) {
    console.warn('⚠️ No products matched productIds, using first 3 as fallback')
    productsToShow = recommendationData.fullProductData.slice(0, 3)
  }
  
  console.log('📦 Product IDs to show:', recommendationData.productIds)
  console.log('📦 Mapped products:', productsToShow.map(p => ({ id: p.id, legacyId: p.legacyId, title: p.title })))
  
  const handleContinue = () => {
    console.log('🔘 User clicked "Започни разговор с AI" button')
    onContinue()
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
          {recommendationData.suggestion}
        </p>
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Твоите Препоръчани Кристали:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {productsToShow.map((product, index) => (
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
          onClick={handleContinue}
          className="btn-primary text-xl"
        >
          Започни разговор с AI
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

