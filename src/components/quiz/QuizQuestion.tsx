'use client'

import { motion } from 'framer-motion'
import { QuizData } from '@/types/quiz'
import ProgressBar from '@/components/ui/ProgressBar'
import NameQuestion from './questions/NameQuestion'
import BirthdateQuestion from './questions/BirthdateQuestion'
import HappinessQuestion from './questions/HappinessQuestion'
import AchievementQuestion from './questions/AchievementQuestion'
import NeedsQuestion from './questions/NeedsQuestion'
import MorningFeelingQuestion from './questions/MorningFeelingQuestion'
import MissingFeelingsQuestion from './questions/MissingFeelingsQuestion'
import ReleaseQuestion from './questions/ReleaseQuestion'
import BeachQuestion from './questions/BeachQuestion'
import EmailQuestion from './questions/EmailQuestion'
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
          <MorningFeelingQuestion
            morningFeeling={quizData.morningFeeling}
            onUpdate={(morningFeeling) => onUpdate({ morningFeeling })}
            onNext={onNext}
          />
        )
      case 7:
        return (
          <MissingFeelingsQuestion
            missingFeelings={quizData.missingFeelings}
            onUpdate={(missingFeelings) => onUpdate({ missingFeelings })}
            onNext={onNext}
          />
        )
      case 8:
        return (
          <ReleaseQuestion
            release={quizData.release}
            onUpdate={(release) => onUpdate({ release })}
            onNext={onNext}
          />
        )
      case 9:
        return (
          <BeachQuestion
            beachAction={quizData.beachAction}
            onUpdate={(beachAction) => onUpdate({ beachAction })}
            onNext={onNext}
          />
        )
      case 10:
        return (
          <EmailQuestion
            email={quizData.email}
            onUpdate={(email) => onUpdate({ email })}
            onNext={onNext}
          />
        )
      case 11:
        return (
          <ObstaclesQuestion
            obstacles={quizData.obstacles}
            quizData={quizData}
            onUpdate={(obstacles) => onUpdate({ obstacles })}
            onNext={onNext}
          />
        )
      case 12:
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
      {step < 12 && step > 0 && <ProgressBar current={step} total={11} />}
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

