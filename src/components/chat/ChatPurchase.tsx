'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizData } from '@/types/quiz'
import ChatInterface from './ChatInterface'
import OrderSummary from './OrderSummary'

interface ChatPurchaseProps {
  quizData: QuizData
}

export default function ChatPurchase({ quizData }: ChatPurchaseProps) {
  const [showOrder, setShowOrder] = useState(false)
  const [orderData, setOrderData] = useState(null)

  const handleOrderComplete = (data: any) => {
    setOrderData(data)
    setShowOrder(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {!showOrder ? (
        <ChatInterface 
          quizData={quizData}
          onOrderComplete={handleOrderComplete}
        />
      ) : (
        <OrderSummary orderData={orderData} />
      )}
    </motion.div>
  )
}

