'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { RefreshCw } from 'lucide-react'
import { QuizData, AIRecommendationData, Product } from '@/types/quiz'
import ProductCard from './ProductCard'
import BundleOffer from './BundleOffer'
import ChatInterface from '@/components/chat/ChatInterface'
import ExitIntentPopup from './ExitIntentPopup'

const testRefresh = true

interface AIRecommendationProps {
  quizData: QuizData
  recommendationData: AIRecommendationData
  onContinue: () => void
  onRefresh?: () => void
}

export default function AIRecommendation({
  quizData,
  recommendationData,
  onContinue,
  onRefresh,
}: AIRecommendationProps) {
  const [showChat, setShowChat] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string>('')

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
  
  const handleButtonClick = (message: string) => {
    setInitialMessage(message)
    setShowChat(true)
  }

  const handleOrderComplete = (data: any) => {
    // Това ще се използва по-късно когато се интегрира логиката за поръчка
    console.log('Order complete:', data)
    onContinue()
  }

  // Функция за разделяне на текста на изречения по точки
  const formatSuggestion = (text: string): string[] => {
    return text
      .split(/\.\s+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => sentence.endsWith('.') ? sentence : sentence + '.')
  }

  const suggestionSentences = formatSuggestion(recommendationData.suggestion)

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card relative"
    >
      {/* Тестов бутон за рефреш */}
      {testRefresh && (
        <button
          onClick={handleRefresh}
          className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Рефреш на стъпката"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      )}
      {/* Банерът - инстантно без анимация */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-full text-xl font-bold mb-4">
          ✨ Твоите резултати са готови, {quizData.name}! ✨
        </div>
      </div>

      {/* Секция с аватар и съобщение */}
      <div className="bg-gradient-to-br from-white via-pink-100/50 to-pink-50/50 border-2 border-purple-200 p-8 rounded-2xl mb-8 shadow-md">
        {/* Аватар - появява се от долу нагоре */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src="/avatar.jpg"
              alt="AI Avatar"
              width={85}
              height={85}
              className="w-full h-full object-cover object-[center_15%]"
            />
          </div>
        </motion.div>

        {/* Съобщението - изтегля се нагоре след аватара */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="text-xl md:text-xl text-gray-900 leading-relaxed text-center font-medium space-y-2"
        >
          {suggestionSentences.map((sentence, index) => (
            <p key={index}>{sentence}</p>
          ))}
        </motion.div>
      </div>

      {/* Останалите елементи - появяват се след съобщението */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800"
      >
        Твоите Препоръчани Кристали:
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {productsToShow.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Bundle Offer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <BundleOffer products={productsToShow} />
      </motion.div>

      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <ChatInterface
            quizData={quizData}
            initialMessage={initialMessage}
            onOrderComplete={handleOrderComplete}
          />
        </motion.div>
      )}

      {/* Exit Intent Pop-up */}
      {!showChat && (
        <ExitIntentPopup
          onQuestionClick={() => handleButtonClick('Имам Въпроси')}
          userName={quizData.name}
        />
      )}
    </motion.div>
  )
}

