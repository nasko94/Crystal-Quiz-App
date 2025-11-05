'use client'

import { motion } from 'framer-motion'
import { Product } from '@/types/quiz'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-secondary flex items-center justify-center p-8">
        {/* Placeholder за снимка */}
        <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center">
          <span className="text-6xl">💎</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient">
            {product.price.toFixed(2)} лв
          </span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            Виж повече
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

