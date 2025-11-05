'use client'

import { motion } from 'framer-motion'
import { QuizData } from '@/types/quiz'
import ProgressBar from '@/components/ui/ProgressBar'
import NameQuestion from './questions/NameQuestion'
import BirthdateQuestion from './questions/BirthdateQuestion'
import HappinessQuestion from './questions/HappinessQuestion'
import AchievementQuestion from './questions/AchievementQuestion'
import NeedsQuestion from './questions/NeedsQuestion'
import ObstaclesQuestion from './questions/ObstaclesQuestion'
import LoadingScreen from './LoadingScreen'
import { AIRecommendationData } from '@/types/quiz'

interface QuizQuestionProps {
  step: number
  quizData: QuizData
  onUpdate: (data: Partial<QuizData>) => void
  onNext: () => void
  onRecommendationComplete?: (data: AIRecommendationData) => void
}

export default function QuizQuestion({
  step,
  quizData,
  onUpdate,
  onNext,
  onRecommendationComplete,
}: QuizQuestionProps) {
  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <NameQuestion
            name={quizData.name}
            onUpdate={(name) => onUpdate({ name })}
            onNext={onNext}
          />
        )
      case 2:
        return (
          <BirthdateQuestion
            name={quizData.name}
            dateOfBirth={quizData.dateOfBirth}
            onUpdate={(dateOfBirth, zodiacSign) =>
              onUpdate({ dateOfBirth, zodiacSign })
            }
            onNext={onNext}
          />
        )
      case 3:
        return (
          <HappinessQuestion
            name={quizData.name}
            zodiacSign={quizData.zodiacSign}
            happinessLevel={quizData.happinessLevel}
            onUpdate={(happinessLevel) => onUpdate({ happinessLevel })}
            onNext={onNext}
          />
        )
      case 4:
        return (
          <AchievementQuestion
            lastAchievement={quizData.lastAchievement}
            happinessLevel={quizData.happinessLevel}
            onUpdate={(lastAchievement) => onUpdate({ lastAchievement })}
            onNext={onNext}
          />
        )
      case 5:
        return (
          <NeedsQuestion
            needs={quizData.needs}
            onUpdate={(needs) => onUpdate({ needs })}
            onNext={onNext}
          />
        )
      case 6:
        return (
          <ObstaclesQuestion
            obstacles={quizData.obstacles}
            quizData={quizData}
            onUpdate={(obstacles) => onUpdate({ obstacles })}
            onNext={onNext}
          />
        )
      case 7:
        return (
          <LoadingScreen 
            name={quizData.name} 
            quizData={quizData} 
            onComplete={onRecommendationComplete || ((data: AIRecommendationData) => onNext())} 
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {step < 7 && step > 0 && <ProgressBar current={step} total={6} />}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        {renderQuestion()}
      </motion.div>
    </>
  )
}

