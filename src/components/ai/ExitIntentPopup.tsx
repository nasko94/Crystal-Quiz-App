'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ExitIntentPopupProps {
  onQuestionClick: () => void
  userName: string
}

export default function ExitIntentPopup({ onQuestionClick, userName }: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (hasShown) return // Ако вече е показан, не показваме отново

    // Таймер за 5 минути
    const timer = setTimeout(() => {
      if (!hasShown) {
        setShowPopup(true)
        setHasShown(true)
      }
    }, 5 * 60 * 1000) // 5 минути в милисекунди

    // Exit intent detection - когато мишката излиза от страницата
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true)
        setHasShown(true)
      }
    }

    // Beforeunload - показваме pop-up преди да се опитат да излязат
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShown && !showPopup) {
        // Не можем да покажем pop-up тук, но можем да покажем браузър диалог
        e.preventDefault()
        e.returnValue = ''
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasShown, showPopup])

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleQuestionClick = () => {
    setShowPopup(false)
    onQuestionClick()
  }

  if (!mounted) return null

  const popupContent = (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Pop-up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-xs w-full shadow-2xl relative z-[10000]"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="/pop-up-avatar.jpg"
                    alt="AI Avatar"
                    width={85}
                    height={85}
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-6"
              >
                <p className="text-lg text-gray-800 leading-relaxed">
                  Хей, имаш ли някакви въпроси относно кристалите? Ще се радвам да ти отговоря веднага!
                </p>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuestionClick}
                  className="bg-white border-2 border-purple-500 text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors w-full"
                >
                  Имам Въпроси
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(popupContent, document.body)
}

