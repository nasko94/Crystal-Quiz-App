'use client'

import { motion } from 'framer-motion'
import { Sparkles, CheckCircle, Shield, Heart, Zap, Star, HelpCircle } from 'lucide-react'

interface QuizIntroProps {
  onStart: () => void
}

export default function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          Кристален Тест
        </h1>
        
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Здравей приятелю! В този Кристален Тест ще ти помогнем да намериш 
          точният кристал за своите нужди.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-primary text-xl"
        >
          Да започваме!
        </motion.button>
      </motion.div>

      {/* Section 1: Как работи? */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="card max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          🔮 Как работи тестът?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-secondary rounded-2xl">
            <div className="text-4xl mb-4">1️⃣</div>
            <h3 className="text-xl font-semibold mb-3">Отговаряш на въпроси</h3>
            <p className="text-gray-700">Няколко бързи въпроса за теб и твоята енергия</p>
          </div>
          <div className="text-center p-6 bg-gradient-secondary rounded-2xl">
            <div className="text-4xl mb-4">2️⃣</div>
            <h3 className="text-xl font-semibold mb-3">Персонален Анализ</h3>
            <p className="text-gray-700">Нашият кристален асистент анализира твоята енергия и нужди</p>
          </div>
          <div className="text-center p-6 bg-gradient-secondary rounded-2xl">
            <div className="text-4xl mb-4">3️⃣</div>
            <h3 className="text-xl font-semibold mb-3">Получаваш препоръка</h3>
            <p className="text-gray-700">Персонална кристална препоръка + специална отстъпка</p>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Какво ще получиш? */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          Какво ще получиш от теста?
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-lg text-gray-800">Намираш правилния кристал, без да се чудиш</p>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-lg text-gray-800">Разбираш каква енергия е най-силна за теб в момента</p>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-lg text-gray-800">Спестяваш време и пари</p>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-lg text-gray-800">Получаваш 10% отстъпка на препоръчания комплект</p>
          </div>
        </div>
      </motion.div>

      {/* Section 3: За кого е този тест? */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="card max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          За кого е този тест?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-secondary rounded-xl">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800">Ако искаш повече защита</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-secondary rounded-xl">
            <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800">Ако усещаш тревожност или дисбаланс</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-secondary rounded-xl">
            <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800">Ако искаш да привлечеш любов, изобилие или спокойствие</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-secondary rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <p className="text-gray-800">Ако искаш персонално подбрани енергии</p>
          </div>
        </div>
      </motion.div>

      {/* Section 5: Ревюта */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="card max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          Какво казват хората?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-secondary rounded-xl">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-800 mb-3">"Тестът позна 1:1 от какво имам нужда."</p>
            <p className="text-sm text-gray-600">- Мария К.</p>
          </div>
          <div className="p-6 bg-gradient-secondary rounded-xl">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-800 mb-3">"От както нося турмалина, спя много по-спокойно."</p>
            <p className="text-sm text-gray-600">- Георги Д.</p>
          </div>
          <div className="p-6 bg-gradient-secondary rounded-xl">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-800 mb-3">"Точно това търсех — нещо персонално!"</p>
            <p className="text-sm text-gray-600">- Елена П.</p>
          </div>
        </div>
      </motion.div>

      {/* Section 6: FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="card max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          Често задавани въпроси
        </h2>
        <div className="space-y-4">
          <div className="p-5 bg-gradient-secondary rounded-xl">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <h3 className="font-semibold text-lg">Колко време отнема тестът?</h3>
            </div>
            <p className="text-gray-700 ml-9">Само 2-3 минути за всички въпроси!</p>
          </div>
          <div className="p-5 bg-gradient-secondary rounded-xl">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <h3 className="font-semibold text-lg">Наистина ли е персонализиран?</h3>
            </div>
            <p className="text-gray-700 ml-9">Да! нашият кристален асистент анализира твоите отговори и създава уникална препоръка специално за теб.</p>
          </div>
          <div className="p-5 bg-gradient-secondary rounded-xl">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <h3 className="font-semibold text-lg">Кристалите истински ли са?</h3>
            </div>
            <p className="text-gray-700 ml-9">100% натурални и енергийно пречистени камъни!</p>
          </div>
          <div className="p-5 bg-gradient-secondary rounded-xl">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <h3 className="font-semibold text-lg">Има ли отстъпка?</h3>
            </div>
            <p className="text-gray-700 ml-9">Да! Получаваш 10% отстъпка и безплатна доставка при 3+ продукта.</p>
          </div>
        </div>
      </motion.div>

      {/* Section 7: Защо CrystalEnergy? */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="card max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gradient">
          Защо Crystal Energy?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <p className="text-lg text-gray-800">Истински натурални камъни</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <p className="text-lg text-gray-800">Ръчно изработени</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <p className="text-lg text-gray-800">Енергийно пречистени</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-secondary rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <p className="text-lg text-gray-800">Хиляди доволни клиенти</p>
          </div>
        </div>
      </motion.div>

      {/* Section 8: Силен CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="card text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
          💜 Готов ли си да откриеш своя кристал?
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Натисни и започни теста!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-primary text-xl"
        >
          Да започваме →
        </motion.button>
      </motion.div>

      {/* Section 9: Гаранция */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Shield className="w-5 h-5" />
          <p>Личните ти данни са защитени</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <CheckCircle className="w-5 h-5" />
          <p>Резултатът е персонален и напълно безплатен</p>
        </div>
      </motion.div>
    </div>
  )
}

