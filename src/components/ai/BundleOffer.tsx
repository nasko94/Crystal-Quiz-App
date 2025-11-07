'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Product, QuizData } from '@/types/quiz'
import OrderPopup from './OrderPopup'

interface BundleOfferProps {
  products: Product[]
  quizData: QuizData
  onOrderComplete?: (orderData: any) => void
}

export default function BundleOffer({ products, quizData, onOrderComplete }: BundleOfferProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 минути = 600 секунди
  const [showOrderPopup, setShowOrderPopup] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Форматираме времето в MM:SS формат
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Изчисляваме общата цена и цената с 10% отстъпка
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0)
  const discountedPrice = totalPrice * 0.9 // 10% отстъпка
  const savings = totalPrice - discountedPrice

  // Взимаме първата снимка от всеки продукт
  const getFirstImage = (product: Product): string | null => {
    if (!product.images || product.images.length === 0) return null
    const firstImage = product.images[0]
    return typeof firstImage === 'string' ? firstImage : (firstImage as any)?.src || null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          🎁 Вземи своите кристали в комплект
        </h3>
        <p className="text-lg text-gray-700 mb-2">
          до <span className="font-bold text-red-500 text-xl">{formatTime(timeLeft)}</span> и получи <span className="font-bold text-purple-600">10% отстъпка + безплатна доставка</span>!
        </p>
        {timeLeft === 0 && (
          <p className="text-sm text-gray-500 italic">
            Времето изтече, но офертата все още е валидна!
          </p>
        )}
      </div>

      {/* Продуктите */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center -space-x-6 md:space-x-0 md:gap-6">
          {products.map((product, index) => {
            const imageUrl = getFirstImage(product)
            return (
              <div key={product.id} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="relative z-10"
                  style={{ zIndex: products.length - index }}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title || product.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
                        <span className="text-3xl">💎</span>
                      </div>
                    )}
                  </div>
                </motion.div>
                {index < products.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    className="hidden md:block text-5xl text-purple-400 font-bold mx-2"
                  >
                    +
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Цените */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Оригинална цена</p>
          <div className="text-2xl font-bold text-gray-400 line-through">
            {totalPrice.toFixed(2)} лв
          </div>
        </div>
        
        <div className="text-purple-500 text-2xl font-bold">→</div>
        
        <div className="text-center">
          <p className="text-sm text-purple-600 mb-1 font-semibold">С отстъпка</p>
          <div className="text-2xl font-bold text-gradient">
            {discountedPrice.toFixed(2)} лв
          </div>
        </div>
      </div>

      {/* Спестена сума */}
      <div className="text-center mb-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-sm text-gray-600"
        >
          💰 Спестяваш {savings.toFixed(2)} лв и безплатна доставка!
        </motion.p>
      </div>

      {/* Бутон за вземане */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOrderPopup(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-colors"
        >
          ВЗЕМИ СЕГА
        </motion.button>
      </motion.div>

      {/* Order Popup */}
      {showOrderPopup && (
        <OrderPopup
          products={products}
          quizData={quizData}
          onClose={() => setShowOrderPopup(false)}
          onOrder={(orderData) => {
            setShowOrderPopup(false)
            if (onOrderComplete) {
              onOrderComplete(orderData)
            }
          }}
        />
      )}
    </motion.div>
  )
}

