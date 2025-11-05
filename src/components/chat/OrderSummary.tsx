'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Package, MapPin, Phone, CreditCard, Home, TrendingUp, BookOpen } from 'lucide-react'

interface OrderSummaryProps {
  orderData: any
}

export default function OrderSummary({ orderData }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card max-w-3xl mx-auto"
    >
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Вашата Поръчка е Създадена!
        </h1>
        <p className="text-gray-600 text-lg">
          Номер на поръчка: <span className="font-bold">#{orderData.orderNumber}</span>
        </p>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-secondary p-6 rounded-2xl mb-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Данни за Доставка
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-lg">
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Име</p>
              <p className="font-semibold">{orderData.firstName} {orderData.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Phone className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Телефон</p>
              <p className="font-semibold">{orderData.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="bg-white p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Адрес за доставка</p>
              <p className="font-semibold">{orderData.econt}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-2 border-purple-100 rounded-2xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Продукти</h2>
        <div className="space-y-3">
          {orderData.products.map((product: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">{product.name}</span>
              <span className="font-semibold">{product.price.toFixed(2)} лв</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border-2 border-purple-100 rounded-2xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ценоразпис</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Продукти:</span>
            <span>{orderData.subtotal.toFixed(2)} лв</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Доставка:</span>
            <span>{orderData.shipping.toFixed(2)} лв</span>
          </div>
          {orderData.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Намаление (QUIZ10):</span>
              <span>-{orderData.discount.toFixed(2)} лв</span>
            </div>
          )}
          <div className="border-t-2 border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold text-gradient">
              <span>Тотал:</span>
              <span>{orderData.total.toFixed(2)} лв</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mt-4">
            <CreditCard className="w-5 h-5" />
            <span className="font-semibold">Метод на Плащане: Наложен Платеж</span>
          </div>
        </div>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-6"
      >
        <p className="text-lg text-gray-700 leading-relaxed">
          Благодаря, че сте клиент на <span className="text-gradient font-bold">Crystal Energy</span>! 
          <br />
          Нашият екип ще изпрати вашите продукти в най-ранен срок!
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col items-center gap-4 max-w-md mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center justify-center gap-2 w-full"
        >
          <Home className="w-5 h-5" />
          Към началната страница
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center justify-center gap-2 w-full"
        >
          <TrendingUp className="w-5 h-5" />
          Към най-продавани
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center justify-center gap-2 w-full"
        >
          <BookOpen className="w-5 h-5" />
          Към статиите
        </motion.button>
      </motion.div>

      {/* Final Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <p className="text-2xl font-bold text-gradient">Довиждане! ✨</p>
      </motion.div>
    </motion.div>
  )
}

function User({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

