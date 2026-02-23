'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Gem, User } from 'lucide-react'
import Image from 'next/image'
import { QuizData, AIRecommendationData, Product } from '@/types/quiz'
import { getHappinessLabel, getAchievementLabel, getNeedsLabel } from '@/utils/zodiac'
import { apiUrl } from '@/config/api'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Конфигурираме marked
marked.setOptions({ breaks: true, gfm: true })

// Добавя класове към генерираните тагове
const addClasses = (html: string) => {
  // <strong>
  html = html.replaceAll('<strong>', '<strong class="font-semibold">')
  // <a>
  html = html.replaceAll(
    '<a ',
    '<a class="text-purple-600 hover:text-purple-800 underline font-semibold" '
  )
  return html
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface ChatInterfaceProps {
  quizData: QuizData
  recommendationData?: AIRecommendationData
  initialMessage?: string
  onOrderComplete: (data: any) => void
}

export default function ChatInterface({ quizData, recommendationData, initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatThreadId, setChatThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasAddedInitialMessage = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Функция за форматиране на AI отговора с линкове и болднат текст
  const formatMessage = (raw: string) => {
    if (!raw) return ''

    let text = raw

    // 1) **Име на продукт** (https://...)  ->  [Име на продукт](https://...)
    text = text.replace(
      /\*\*([^*]+?)\*\*\s*\((https?:\/\/[^)\s]+)\)/g,
      (_m, label, url) => `[${String(label).trim()}](${url})`
    )

    // 2) „Име на продукт" (https://...) или "Име на продукт" (https://...)
    text = text.replace(
      /[„"]([^"”„]+)[”"]\s*\((https?:\/\/[^)\s]+)\)/g,
      (_m, label, url) => `[${String(label).trim()}](${url})`
    )

    // ❌ НЕ правим повече „Текст (URL)" замени – за да не линкваме цели изречения

    // 3) Markdown → HTML
    let html = marked.parse(text) as string

    // 4) Санитизация (безопасни тагове)
    html = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    })

    // 5) Класове
    html = addClasses(html)

    return html
  }  

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

  // Зареждаме chatThreadId от sessionStorage при mount
  useEffect(() => {
    const storedThreadId = sessionStorage.getItem('crystalChatThreadId')
    if (storedThreadId) {
      setChatThreadId(storedThreadId)
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const messageText = input
    setInput('')
    
    // Проверяваме дали това е първото съобщение след "Разбира се! Кажи ми какво те интересува?"
    // Това е когато няма chatThreadId и последното AI съобщение е "Разбира се! Кажи ми какво те интересува?"
    const lastAIMessage = messages.filter(m => m.sender === 'ai').pop()
    const isFirstUserMessage = !chatThreadId && lastAIMessage?.text === 'Разбира се! Кажи ми какво те интересува?'

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      let requestBody: any
      
      if ((isFirstUserMessage || !chatThreadId) && recommendationData) {
        // Първа заявка - изпращаме всички данни
        const answers = {
          name: quizData.name,
          dateOfBirth: quizData.dateOfBirth,
          zodiacSign: quizData.zodiacSign,
          happinessLevel: quizData.happinessLevel,
          happinessLabel: getHappinessLabel(quizData.happinessLevel),
          lastAchievement: getAchievementLabel(quizData.lastAchievement),
          needs: getNeedsLabel(quizData.needs),
          obstacles: quizData.obstacles.trim() || '',
        }

        // Подготвяме primaryRecommendation - AI отговор + 3те продукта
        const recommendedProducts = recommendationData.productIds
          .map(productId => {
            const searchId = String(productId)
            return recommendationData.fullProductData.find(
              product => String(product.legacyId) === searchId || String(product.id) === searchId
            )
          })
          .filter((product): product is Product => product !== undefined)
          .slice(0, 3)

        const primaryRecommendation = recommendedProducts.map(product => ({
          id: product.legacyId || product.id,
          title: product.title || product.name || 'Продукт',
          description: product.description,
          price: product.price.toFixed(2),
          url: product.handle ? `https://crystalenergy.shop/products/${product.handle}` : '',
        }))

        // Подготвяме catalog - всички продукти
        const catalog = recommendationData.fullProductData.map(product => ({
          id: product.legacyId || product.id,
          title: product.title || product.name || 'Продукт',
          description: product.description,
          price: product.price.toFixed(2),
          available: product.available !== false,
          url: product.handle ? `https://crystalenergy.shop/products/${product.handle}` : '',
        }))

        // Подготвяме pastMessages - "Имам Въпроси" и "Разбира се! Кажи ми какво те интересува?"
        const pastMessages = [
          { role: 'user', content: initialMessage || 'Имам Въпроси' },
          { role: 'assistant', content: 'Разбира се! Кажи ми какво те интересува?' },
        ]

        requestBody = {
          message: messageText,
          answers,
          primaryRecommendation,
          catalog,
          pastMessages,
        }
      } else if (chatThreadId) {
        // Последващи заявки - изпращаме само message и chatThread
        requestBody = {
          message: messageText,
          chatThread: chatThreadId,
        }
      } else {
        // Няма данни за първа заявка и няма threadId
        throw new Error('Няма данни за започване на чат. Моля опитайте отново.')
      }

      console.log('📤 Sending chat request:', {
        isFirstUserMessage,
        hasThreadId: !!chatThreadId,
        hasRecommendationData: !!recommendationData,
        messageLength: messageText.length,
      })

      const response = await fetch(apiUrl('/crystal-assistant-chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Chat API Response:', JSON.stringify(data, null, 2))

      if (data.success && data.response) {
        // Запаметяваме threadId ако е нов
        if (data.threadId && (!chatThreadId || isFirstUserMessage)) {
          setChatThreadId(data.threadId)
          sessionStorage.setItem('crystalChatThreadId', data.threadId)
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Съжалявам, възникна грешка. Моля опитайте отново.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl backdrop-blur-sm p-4 md:p-8 w-full max-w-full md:max-w-4xl mx-auto">
      <div className="bg-gradient-primary text-white px-4 md:px-6 py-4 rounded-t-2xl -mt-8 -mx-4 md:-mx-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
          <Gem className="w-6 h-6 md:w-8 md:h-8" />
          <span className="leading-tight">Вашият Кристален Асистент</span>
        </h2>
      </div>

      <div className="h-[500px] overflow-y-auto mb-6 space-y-4 px-1 md:px-2">
        <AnimatePresence>
          {messages.map((message, index) => {
            // Показваме аватари само за първите две съобщения
            const showAvatar = index < 2
            return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center ${showAvatar ? 'gap-3' : ''} ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {showAvatar && (
              <div className={`
                flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center
                ${message.sender === 'ai' ? 'w-12 h-12 border-2 border-white shadow-md' : 'w-10 h-10 bg-purple-200'}
              `}>
                {message.sender === 'ai' ? (
                  <Image
                    src="/avatar.jpg"
                    alt="AI Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover object-[center_-10%] scale-125"
                  />
                ) : (
                  <User className="w-6 h-6 text-purple-600" />
                )}
              </div>
              )}

              <div className={`
                max-w-[85%] md:max-w-[70%] min-w-0 px-3 md:px-4 py-2 md:py-3 rounded-2xl
                ${message.sender === 'ai' 
                  ? 'bg-gradient-secondary text-gray-800' 
                  : 'bg-purple-600 text-white'
                }
              `}>
                {message.sender === 'ai' ? (
                  <div 
                    className="text-sm leading-relaxed chat-bubble"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{message.text}</p>
                )}
              </div>
            </motion.div>
          )})}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image
                    src="/avatar.jpg"
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

      <div className="flex gap-2 md:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напиши съобщение..."
          className="input-field flex-1 py-3 px-4 md:px-6 text-base md:text-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-100 hover:border-purple-300"
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
    </div>
  )
}

