'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { QuizData, AIRecommendationData } from '@/types/quiz'
import { getNeedsLabel, getAchievementLabel, getHappinessLabel, getMorningFeelingLabel, getMissingFeelingsLabel, getReleaseLabel, getBeachActionLabel } from '@/utils/zodiac'

interface LoadingScreenProps {
  name: string
  quizData: QuizData
  onComplete: (data: AIRecommendationData) => void
}

export default function LoadingScreen({ name, quizData, onComplete }: LoadingScreenProps) {
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)
  const hasCalledOnCompleteRef = useRef(false)

  useEffect(() => {
    // Ако вече е извикано onComplete, не правим нищо
    if (hasCalledOnCompleteRef.current) {
      console.log('⏭️ onComplete already called, skipping')
      return
    }

    const sendRecommendedProductsEvent = async (recommendationData: AIRecommendationData) => {
      try {
        // Вземаме първите 3 продукта
        const products = recommendationData.fullProductData.slice(0, 3)
        
        // Форматираме продуктите
        const properties: any = {
          quiz_type: 'crystal_quiz',
          suggestion: recommendationData.suggestion,
        }
        
        const profileProperties: any = {}
        
        products.forEach((product, index) => {
          const productName = product.title || product.name || 'Продукт'
          const productHandle = product.handle || ''
          const productId = product.id || product.legacyId || ''
          const productUrl = productHandle 
            ? `https://crystalenergy.shop/products/${productHandle}`
            : ''
          
          const productIndex = index + 1
          
          // В properties: структурирани данни за всеки продукт
          properties[`product${productIndex}_name`] = productName
          properties[`product${productIndex}_handle`] = productHandle
          properties[`product${productIndex}_id`] = productId
          properties[`product${productIndex}_url`] = productUrl
          
          // В profileProperties: само URL
          if (productUrl) {
            profileProperties[`suggestedItem${productIndex}`] = productUrl
          }
        })
        
        properties.total_products = products.length

        const eventData = {
          metricName: 'RecommendedProducts',
          email: quizData.email,
          properties,
          profileProperties,
        }

        const eventResponse = await fetch('https://api.flow-fast.ai/crystal-klaviyo-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        })

        if (eventResponse.ok) {
          console.log('✅ Klaviyo event sent successfully')
        } else {
          console.warn('⚠️ Failed to send Klaviyo event:', await eventResponse.text())
        }
      } catch (err) {
        // Не показваме грешка на потребителя, само логваме
        console.error('Error sending Klaviyo event:', err)
      }
    }

    const saveToKlaviyo = async () => {
      try {
        // Split name into first_name only
        const nameParts = quizData.name.trim().split(' ')
        const firstName = nameParts[0] || ''

        // Prepare Klaviyo profile data
        const klaviyoData = {
          email: quizData.email,
          listId: 'TTuXNS',
          first_name: firstName,
          customSource: 'AI QUIZ FUNNEL',
          properties: {
            'Zodiac Sign': quizData.zodiacSign,
            'Happiness Level': quizData.happinessLevel,
            'Last Achievement': getAchievementLabel(quizData.lastAchievement),
            'Needs': getNeedsLabel(quizData.needs),
            'Morning Feeling': getMorningFeelingLabel(quizData.morningFeeling || ''),
            'Missing Feelings': getMissingFeelingsLabel(quizData.missingFeelings || ''),
            'Release': getReleaseLabel(quizData.release || ''),
            'Beach Action': getBeachActionLabel(quizData.beachAction || ''),
            'Obstacles': quizData.obstacles.trim() || '',
            'Date of Birth': quizData.dateOfBirth,
          },
        }

        const klaviyoResponse = await fetch('https://api.flow-fast.ai/crystal-klaviyo-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(klaviyoData),
        })

        if (klaviyoResponse.ok) {
          const result = await klaviyoResponse.json()
          console.log('✅ Klaviyo profile saved successfully', result)
        } else {
          console.warn('⚠️ Failed to save Klaviyo profile:', await klaviyoResponse.text())
        }
      } catch (err) {
        // Не показваме грешка на потребителя, само логваме
        console.error('Error saving to Klaviyo:', err)
      }
    }

    const fetchRecommendation = async () => {
      try {
        // Изпращаме заявката към Klaviyo паралелно (не чакаме резултата)
        saveToKlaviyo()

        // Подготвяме данните за API заявката
        const answers = {
          name: quizData.name,
          dateOfBirth: quizData.dateOfBirth,
          zodiacSign: quizData.zodiacSign,
          happinessLevel: quizData.happinessLevel,
          happinessLabel: getHappinessLabel(quizData.happinessLevel),
          lastAchievement: getAchievementLabel(quizData.lastAchievement),
          needs: getNeedsLabel(quizData.needs),
          morningFeeling: quizData.morningFeeling || '',
          missingFeelings: quizData.missingFeelings || '',
          release: quizData.release || '',
          beachAction: quizData.beachAction || '',
          obstacles: quizData.obstacles.trim() || '',
        }

        const response = await fetch('https://api.flow-fast.ai/crystal-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: AIRecommendationData = await response.json()

        // Логваме целия server response
        console.log('📥 Server Response:', JSON.stringify(data, null, 2))

        if (data.success && data.fullProductData && Array.isArray(data.fullProductData)) {
          // Изпращаме event към Klaviyo с препоръчаните продукти
          await sendRecommendedProductsEvent(data)

          // Проверяваме дали вече е извикано
          if (hasCalledOnCompleteRef.current) {
            console.warn('⚠️ onComplete already called, skipping')
            return
          }
          console.log('✅ Data is valid, calling onComplete')
          hasCalledOnCompleteRef.current = true
          onComplete(data)
        } else {
          console.error('❌ Invalid response format:', data)
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err)
        setError(err instanceof Error ? err.message : 'Грешка при зареждане на препоръките')
      }
    }

    fetchRecommendation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center max-w-2xl mx-auto"
      >
        <div className="text-red-500 mb-4">
          <h2 className="text-2xl font-bold mb-2">Грешка</h2>
          <p>{error}</p>
        </div>
      </motion.div>
    )
  }

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
        Моля изчакай, {name}, докато нашият кристален консултант подготвя персонализираните препоръки за теб
      </p>

      {countdown > 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg md:text-xl text-gray-700 mb-4 font-semibold"
        >
          Готови сме след {countdown}
        </motion.p>
      ) : null}

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

      {countdown === 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-gray-600 mt-4"
        >
          Съвсем малко остана..
        </motion.p>
      )}
    </motion.div>
  )
}

