'use client'

import { useState } from 'react'
import QuizIntro from '@/components/quiz/QuizIntro'
import QuizQuestion from '@/components/quiz/QuizQuestion'
import AIRecommendation from '@/components/ai/AIRecommendation'
import ChatPurchase from '@/components/chat/ChatPurchase'
import { QuizData } from '@/types/quiz'

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

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
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
        return (
          <QuizQuestion
            step={currentStep}
            quizData={quizData}
            onUpdate={updateQuizData}
            onNext={nextStep}
          />
        )
      case 7:
        return (
          <AIRecommendation
            quizData={quizData}
            onContinue={nextStep}
          />
        )
      case 8:
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

