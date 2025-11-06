'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Gem, User } from 'lucide-react'
import Image from 'next/image'
import { QuizData } from '@/types/quiz'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface ChatInterfaceProps {
  quizData: QuizData
  initialMessage?: string
  onOrderComplete: (data: any) => void
}

export default function ChatInterface({ quizData, initialMessage, onOrderComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasAddedInitialMessage = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Добавяме initialMessage като първо съобщение от потребителя, ако е подадено
  useEffect(() => {
    if (initialMessage && !hasAddedInitialMessage.current) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: initialMessage,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([userMessage])
      hasAddedInitialMessage.current = true
      
      // Симулираме AI отговор след малко
      setTimeout(() => {
        const aiResponseText = initialMessage === 'Имам Въпроси' 
          ? 'Разбира се! Кажи ми какво те интересува?'
          : 'Благодаря за отговора! Това е placeholder отговор. AI логиката ще бъде добавена по-късно.'
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1500)
    }
  }, [initialMessage])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // TODO: Тук ще се прави реалното AI извикване
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Благодаря за въпроса! Това е placeholder отговор. AI логиката ще бъде добавена по-късно.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Бутон за тестване на Order Summary
  const testOrderComplete = () => {
    onOrderComplete({
      orderNumber: '1234',
      firstName: 'Тест',
      lastName: 'Тестов',
      phone: '0898765432',
      econt: 'Офис Еконт Виница',
      products: [
        { name: 'Зелен Авантюрин', price: 45.00 },
        { name: 'Розов Кварц', price: 38.00 },
      ],
      subtotal: 83.00,
      shipping: 6.00,
      discount: 8.30,
      total: 80.70,
    })
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="bg-gradient-primary text-white px-6 py-4 rounded-t-2xl -mt-8 -mx-8 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Gem className="w-8 h-8" />
          Вашият Кристален Асистент
        </h2>
      </div>

      <div className="h-[500px] overflow-y-auto mb-6 space-y-4 px-2">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center
                ${message.sender === 'ai' ? 'w-12 h-12 border-2 border-white shadow-md' : 'w-10 h-10 bg-purple-200'}
              `}>
                {message.sender === 'ai' ? (
                  <Image
                    src="/pop-up-avatar.jpg"
                    alt="AI Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover object-[center_-10%] scale-125"
                  />
                ) : (
                  <User className="w-6 h-6 text-purple-600" />
                )}
              </div>

              <div className={`
                max-w-[70%] px-4 py-3 rounded-2xl
                ${message.sender === 'ai' 
                  ? 'bg-gradient-secondary text-gray-800' 
                  : 'bg-purple-600 text-white'
                }
              `}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image
                    src="/pop-up-avatar.jpg"
                    alt="AI Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover object-[center_-10%] scale-125"
                  />
            </div>
            <div className="bg-gradient-secondary px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напиши съобщение..."
          className="input-field flex-1 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-purple-100 hover:border-purple-300"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-gradient-primary text-white p-4 rounded-2xl disabled:opacity-50"
        >
          <Send className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Тестов бутон - премахни след интегриране на AI */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={testOrderComplete}
        className="mt-4 w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
      >
        🧪 Тест: Преглед на Поръчка
      </motion.button>
    </div>
  )
}

