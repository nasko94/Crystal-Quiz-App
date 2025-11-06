'use client'

import { useState } from 'react'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizQuestion from '@/components/quiz/QuizQuestion'
import AIRecommendation from '@/components/ai/AIRecommendation'
import ChatPurchase from '@/components/chat/ChatPurchase'
import { QuizData, AIRecommendationData } from '@/types/quiz'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizData, setQuizData] = useState<QuizData>({
    name: '',
    dateOfBirth: '',
    zodiacSign: '',
    happinessLevel: 5,
    lastAchievement: '',
    needs: '',
    obstacles: '',
  })
  const [recommendationData, setRecommendationData] = useState<AIRecommendationData | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handleRecommendationComplete = (data: AIRecommendationData) => {
    console.log('🎯 handleRecommendationComplete called with:', data)
    setRecommendationData(data)
    nextStep()
  }

  const handleRefreshStep = () => {
    // Рефрешваме само компонента, данните остават непроменени
    setRefreshKey(prev => prev + 1) // Инкрементираме key за форсиране на ре-рендериране
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <QuizIntro onStart={nextStep} />
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return (
          <QuizQuestion
            key={refreshKey}
            step={currentStep}
            quizData={quizData}
            onUpdate={updateQuizData}
            onNext={nextStep}
            onRecommendationComplete={handleRecommendationComplete}
          />
        )
      case 8:
        if (!recommendationData) {
          return (
            <div className="card text-center">
              <p>Зареждане...</p>
            </div>
          )
        }
        return (
          <AIRecommendation
            key={refreshKey}
            quizData={quizData}
            recommendationData={recommendationData}
            onContinue={nextStep}
            onRefresh={handleRefreshStep}
          />
        )
      case 9:
        return <ChatPurchase quizData={quizData} />
      default:
        return <QuizIntro onStart={nextStep} />
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </main>
  )
}

