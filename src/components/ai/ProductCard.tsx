'use client'

import { motion } from 'framer-motion'
import { Product } from '@/types/quiz'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = product.handle 
    ? `https://crystalenergy.shop/products/${product.handle}`
    : null

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-secondary relative overflow-hidden">
        {(() => {
          // Проверяваме дали има изображения
          if (!product.images || product.images.length === 0) {
            return (
              <div className="w-full h-full bg-white/50 flex items-center justify-center">
                <span className="text-6xl">💎</span>
              </div>
            )
          }
          
          // Изображенията могат да бъдат или URL-и (string) или обекти с src свойство
          const firstImage = product.images[0]
          const imageUrl = typeof firstImage === 'string' 
            ? firstImage 
            : (firstImage as any)?.src || null
          
          if (!imageUrl) {
            return (
              <div className="w-full h-full bg-white/50 flex items-center justify-center">
                <span className="text-6xl">💎</span>
              </div>
            )
          }
          
          return (
            <img
              src={imageUrl}
              alt={product.title || product.name || 'Product'}
              className="w-full h-full object-cover"
            />
          )
        })()}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {product.title || product.name || 'Продукт'}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-gradient flex-shrink-0">
            {product.price.toFixed(2)} лв
          </span>
          
          {productUrl ? (
            <motion.a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center whitespace-nowrap flex-shrink-0"
            >
              Виж повече
            </motion.a>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center whitespace-nowrap flex-shrink-0"
            >
              Виж повече
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

