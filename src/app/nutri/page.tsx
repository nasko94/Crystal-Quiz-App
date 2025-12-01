'use client'

import { useState, useEffect } from 'react'

interface Task {
  t: string
  n: string
}

interface TasksData {
  [key: string]: Task[]
}

const defaultData: TasksData = {
  "сутрин": [
    { t: "Омега-3", n: "За мозък, настроение, сърце и кожа" },
    { t: "Цинк", n: "Имунитет, кожа, хормони, фокус" },
    { t: "Движение 10–20 мин", n: "Кратко ходене – светлина + кръв + тонус" },
    { t: "Stretch 5 мин", n: "Освобождава тялото след сън" }
  ],
  "през деня": [
    { t: "Дишане 4–4–6", n: "4с вдишване – 4 задържане – 6 издишване ×10 → нулира стреса" },
    { t: "Микро движение", n: "Кафето се замества с движение – кръвообращение" }
  ],
  "вечер": [
    { t: "Магнезий", n: "200–400мг. Нерви, сън, мускули, цикъл" },
    { t: "Vit D3 + K2", n: "Хормони, имунитет, метаболизъм" },
    { t: "Stretch", n: "Мускули → по-леко заспиване" },
    { t: "Екран хигиена", n: "Без скрол 30 мин преди сън → мелатонин" }
  ],
  "3× седмично": [
    { t: "Vitamin B12", n: "1000–2000µg – нерви, енергия, концентрация" },
    { t: "15–30 мин тренировка", n: "Сила = HDL, фокус, метаболизъм" }
  ]
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export default function NutriPage() {
  const [currentPerson, setCurrentPerson] = useState<'jani' | 'nasko'>('jani')
  const [currentDate, setCurrentDate] = useState<string>(getToday())
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load checked items from localStorage
    const loadCheckedItems = () => {
      if (typeof window === 'undefined') return
      const checked = new Set<string>()
      Object.entries(defaultData).forEach(([section, tasks]) => {
        tasks.forEach((_, index) => {
          const key = `${currentDate}-${currentPerson}-${section}-${index}`
          if (localStorage.getItem(key) === '1') {
            checked.add(key)
          }
        })
      })
      setCheckedItems(checked)
    }

    loadCheckedItems()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCheckedItems()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [currentDate, currentPerson])

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate.toISOString().split('T')[0])
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const days = ['Нед', 'Пон', 'Вт', 'Ср', 'Чет', 'Пет', 'Съб']
    const months = ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек']
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
  }

  const getStorageKey = (section: string, index: number): string => {
    return `${currentDate}-${currentPerson}-${section}-${index}`
  }

  const isChecked = (section: string, index: number): boolean => {
    const key = getStorageKey(section, index)
    return checkedItems.has(key)
  }

  const toggleCheck = (section: string, index: number, checked: boolean) => {
    if (typeof window === 'undefined') return
    const key = getStorageKey(section, index)
    localStorage.setItem(key, checked ? '1' : '0')
    
    // Update state
    const newChecked = new Set(checkedItems)
    if (checked) {
      newChecked.add(key)
    } else {
      newChecked.delete(key)
    }
    setCheckedItems(newChecked)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* TAB HEADER */}
      <div className="flex">
        <button
          onClick={() => setCurrentPerson('jani')}
          className={`flex-1 py-3 text-center transition-all ${
            currentPerson === 'jani'
              ? 'bg-slate-800 border-b-2 border-green-500 font-bold text-green-500'
              : 'bg-slate-700 hover:bg-slate-750'
          }`}
        >
          Жани
        </button>
        <button
          onClick={() => setCurrentPerson('nasko')}
          className={`flex-1 py-3 text-center transition-all ${
            currentPerson === 'nasko'
              ? 'bg-slate-800 border-b-2 border-green-500 font-bold text-green-500'
              : 'bg-slate-700 hover:bg-slate-750'
          }`}
        >
          Наско
        </button>
      </div>

      {/* DATE SELECTOR */}
      <div className="bg-slate-800 py-3 px-4 flex items-center justify-center gap-3">
        <button
          onClick={() => changeDate(-1)}
          className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          ◀ Вчера
        </button>
        <span className="text-lg font-semibold min-w-[180px] text-center">
          {formatDate(currentDate)}
        </span>
        <button
          onClick={() => changeDate(1)}
          className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Утре ▶
        </button>
      </div>

      {/* CONTENT */}
      <div className="pb-8">
        {Object.entries(defaultData).map(([section, tasks]) => (
          <div key={section}>
            <div className="bg-slate-800 py-2 px-4 text-sm font-semibold uppercase tracking-wide">
              {section}
            </div>
            <div className="px-3">
              {tasks.map((task, index) => {
                const checked = isChecked(section, index)
                return (
                  <label
                    key={index}
                    className="flex items-start gap-3 py-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        toggleCheck(section, index, e.target.checked)
                        // Force re-render
                        window.dispatchEvent(new Event('storage'))
                      }}
                      className="w-6 h-6 mt-1 accent-green-500 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="text-base font-medium mb-1">{task.t}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{task.n}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

