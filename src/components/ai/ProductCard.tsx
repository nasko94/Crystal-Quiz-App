'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product, ProductVariant } from '@/types/quiz'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )

  const productUrl = product.handle 
    ? `https://crystalenergy.shop/products/${product.handle}`
    : null

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const hasVariants = product.variants && product.variants.length > 1

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

        {/* Variant Selector */}
        {hasVariants && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {product.options && product.options[0] ? product.options[0] : 
               (product.variants && product.variants[0]?.selectedOptions && product.variants[0].selectedOptions.length > 0
                 ? product.variants[0].selectedOptions[0].name 
                 : 'Вариант')}
            </label>
            <select
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const variant = product.variants?.find(v => v.id === e.target.value)
                setSelectedVariant(variant || null)
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border-2 border-purple-200 
                       focus:border-purple-400 focus:outline-none transition-all duration-300
                       bg-white cursor-pointer hover:border-purple-300 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B59B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1rem',
                paddingRight: '2.5rem',
              }}
            >
              {product.variants?.map((variant) => {
                // Използваме selectedOptions ако е налично, иначе title
                const displayText = variant.selectedOptions && variant.selectedOptions.length > 0
                  ? variant.selectedOptions.map(opt => opt.value).join(' / ')
                  : variant.title
                return (
                  <option key={variant.id} value={variant.id} disabled={variant.available === false}>
                    {displayText} {variant.available === false ? '(Недостъпен)' : ''}
                  </option>
                )
              })}
            </select>
          </div>
        )}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-gradient flex-shrink-0">
            {displayPrice.toFixed(2)} лв
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

