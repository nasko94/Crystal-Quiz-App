# 💎 Crystal Energy Quiz

Интерактивен въпросник за препоръчване на кристали с AI интеграция за Crystal Energy Shop.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## 🚀 Бързо Стартиране

### Инсталация

```bash
# Инсталиране на всички зависимости
npm install
```

### Development

```bash
# Стартиране на dev сървър
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000) в браузъра.

### Production Build

```bash
# Build за production
npm run build

# Стартиране на production сървър
npm start
```

## ✨ Features

### Готови Функционалности
- ✅ Модерен и отзивчив UI дизайн
- ✅ Пълен quiz flow с 6 въпроса
- ✅ Автоматично изчисляване на зодия
- ✅ Красиви анимации и transitions
- ✅ Slider за ниво на щастие
- ✅ Responsive дизайн (mobile + desktop)
- ✅ Chat интерфейс
- ✅ Order summary екран
- ✅ Keyboard navigation

### Предстоящи Интеграции
- ❌ AI API за персонализирани препоръки
- ❌ Реален chat с AI
- ❌ Shopify order creation API
- ❌ Продуктови снимки (placeholder емоджита за сега)

## 📁 Структура на Проекта

```
crystal-energy-quiz/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Глобални стилове
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main quiz flow
│   ├── components/
│   │   ├── quiz/               # Quiz компоненти
│   │   ├── ai/                 # AI препоръки
│   │   └── chat/               # Chat & Order
│   ├── types/                  # TypeScript types
│   └── utils/                  # Helper функции
└── public/                     # Static assets
```

За детайлна информация вижте [DEVELOPMENT.md](./DEVELOPMENT.md)

## 🎨 Design System

Използва цветовата схема на Crystal Energy:
- **Primary**: Розово-лилав градиент (#FF69B4 → #9B59B6)
- **Secondary**: Светло лилаво (#E8B4F0)

### Tailwind Utilities
- `.btn-primary` - Градиент бутон
- `.btn-secondary` - Outline бутон  
- `.card` - Бяла карта със shadow
- `.input-field` - Стилизирано input поле
- `.text-gradient` - Градиент текст

## 🔄 User Flow

1. **Intro Screen** - Приветствие и начало
2. **Quiz Questions** (6 стъпки):
   - Име на потребителя
   - Рожденна дата + зодия
   - Ниво на щастие (0-10)
   - Последно постижение
   - Какво му трябва
   - Какво го спира
3. **AI Loading** - Симулация на AI processing
4. **AI Recommendations** - 3 препоръчани продукта
5. **Chat Interface** - Разговор с AI асистент
6. **Order Summary** - Финализиране на поръчката

## 🛠️ Технологии

- **[Next.js 14](https://nextjs.org/)** - React framework с App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

## 📝 TODO за AI Интеграция

1. **AI Recommendations API** (`src/components/ai/AIRecommendation.tsx`)
   - Създай `/api/ai/recommend` endpoint
   - Интегрирай с AI модел
   - Връща персонализирани продукти

2. **Chat AI** (`src/components/chat/ChatInterface.tsx`)
   - Създай `/api/ai/chat` endpoint
   - Streaming AI отговори
   - Context awareness

3. **Shopify Integration** (`src/components/chat/ChatInterface.tsx`)
   - Създай `/api/shopify/create-order` endpoint
   - Order creation в Shopify
   - Email notifications

Виж [DEVELOPMENT.md](./DEVELOPMENT.md) за детайли.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📄 License

Proprietary - Crystal Energy Shop

---

Създадено с ❤️ за Crystal Energy

