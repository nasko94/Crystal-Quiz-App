# Crystal Energy Quiz - Development Guide

## 📁 Структура на проекта

```
crystal-energy-quiz/
├── src/
│   ├── app/
│   │   ├── globals.css          # Глобални стилове
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Главна страница (quiz flow)
│   ├── components/
│   │   ├── quiz/                # Компоненти за въпросника
│   │   │   ├── QuizIntro.tsx    # Intro екран
│   │   │   ├── QuizQuestion.tsx # Router за въпросите
│   │   │   ├── LoadingScreen.tsx # AI loading екран
│   │   │   └── questions/       # Отделни въпроси
│   │   │       ├── NameQuestion.tsx
│   │   │       ├── BirthdateQuestion.tsx
│   │   │       ├── HappinessQuestion.tsx
│   │   │       ├── AchievementQuestion.tsx
│   │   │       ├── NeedsQuestion.tsx
│   │   │       └── ObstaclesQuestion.tsx
│   │   ├── ai/                  # AI препоръки
│   │   │   ├── AIRecommendation.tsx
│   │   │   └── ProductCard.tsx
│   │   └── chat/                # Chat и поръчка
│   │       ├── ChatPurchase.tsx
│   │       ├── ChatInterface.tsx
│   │       └── OrderSummary.tsx
│   ├── types/
│   │   └── quiz.ts              # TypeScript типове
│   └── utils/
│       └── zodiac.ts            # Helper функции
├── public/                      # Статични файлове
└── [config files]
```

## 🎨 Design System

### Цветова палитра
- **Primary Pink**: `#FF69B4`
- **Primary Purple**: `#9B59B6`
- **Light Purple**: `#E8B4F0`

### Градиенти
- `bg-gradient-primary`: Розово към лилаво
- `bg-gradient-secondary`: Светло лилаво

### UI Компоненти
- `.btn-primary`: Основен бутон с градиент
- `.btn-secondary`: Вторичен бутон с outline
- `.card`: Бяла карта със закръглени ъгли
- `.input-field`: Стилизирано input поле

## 🔄 Quiz Flow

1. **QuizIntro** - Въвеждащ екран
2. **Questions (1-6)** - Серия от въпроси:
   - Име
   - Рожденна дата → изчисляване на зодия
   - Ниво на щастие (0-10 slider)
   - Последно постижение
   - Нужди (4 опции)
   - Препятствия (текстово поле)
3. **LoadingScreen** - AI "обработка"
4. **AIRecommendation** - 3 препоръчани продукта
5. **ChatInterface** - Чат с AI
6. **OrderSummary** - Финален преглед на поръчката

## 🚀 Следващи Стъпки за AI Интеграция

### 1. AI Recommendation API
Файл: `src/components/ai/AIRecommendation.tsx`

```typescript
// TODO: Замени mock данните с реално AI извикване
const getAIRecommendations = async (quizData: QuizData) => {
  const response = await fetch('/api/ai/recommend', {
    method: 'POST',
    body: JSON.stringify(quizData),
  })
  return response.json()
}
```

### 2. Chat AI Integration
Файл: `src/components/chat/ChatInterface.tsx`

```typescript
// TODO: Интегрирай реален AI chat
const sendMessage = async (message: string) => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ 
      message,
      context: quizData,
      conversationHistory: messages 
    }),
  })
  return response.json()
}
```

### 3. Order Creation
Файл: `src/components/chat/ChatInterface.tsx`

```typescript
// TODO: Създай функция за Shopify order
const createOrder = async (orderData: OrderData) => {
  const response = await fetch('/api/shopify/create-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
  return response.json()
}
```

## 📝 Бележки

### Placeholder-и за AI логика:
- ✅ UI flow е готов
- ❌ AI recommendation logic - празно
- ❌ AI chat integration - placeholder
- ❌ Shopify order creation - празно
- ❌ Product images - placeholder емоджита (💎)

### Тестване:
- Всички UI компоненти са функционални
- Quiz flow работи от начало до край
- Има тестов бутон в ChatInterface за преглед на OrderSummary
- Анимациите работят с Framer Motion

## 🎯 Features

- ✨ Модерен и отзивчив дизайн
- 🎨 Красиви анимации с Framer Motion
- 📱 Mobile-friendly (responsive)
- ⌨️ Keyboard navigation (Enter за submit)
- 🎭 Smooth transitions между стъпките
- 🌈 Gradient UI според бранд стила
- 💬 Готов chat интерфейс
- 📦 Готов order summary екран

## 🛠️ Технологии

- **Next.js 14** - React framework с App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Анимации
- **Lucide React** - Икони

