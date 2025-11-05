'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface CustomDatePickerProps {
  value: string
  onChange: (date: string) => void
}

const months = [
  { value: 1, label: 'Януари' },
  { value: 2, label: 'Февруари' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Април' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Юни' },
  { value: 7, label: 'Юли' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Септември' },
  { value: 10, label: 'Октомври' },
  { value: 11, label: 'Ноември' },
  { value: 12, label: 'Декември' },
]

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

const getYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i)
  }
  return years
}

export default function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [day, setDay] = useState<number>(1)
  const [month, setMonth] = useState<number>(1)
  const [year, setYear] = useState<number>(new Date().getFullYear())

  // Parse existing value
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      setDay(date.getDate())
      setMonth(date.getMonth() + 1)
      setYear(date.getFullYear())
    }
  }, [value])

  // Update parent when values change
  useEffect(() => {
    if (day && month && year) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      onChange(dateString)
    }
  }, [day, month, year, onChange])

  const daysInMonth = getDaysInMonth(month, year)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const years = getYears()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-purple-600 mb-2">
        <Calendar className="w-5 h-5" />
        <span className="font-medium">Избери твоята рожденна дата</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Day */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ден
          </label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full px-4 py-4 text-lg font-semibold rounded-2xl border-2 border-purple-200 
                     focus:border-purple-400 focus:outline-none transition-all duration-300
                     bg-white cursor-pointer hover:border-purple-300 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B59B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, '0')}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Month */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Месец
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full px-4 py-4 text-lg font-semibold rounded-2xl border-2 border-purple-200 
                     focus:border-purple-400 focus:outline-none transition-all duration-300
                     bg-white cursor-pointer hover:border-purple-300 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B59B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Year */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Година
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-4 text-lg font-semibold rounded-2xl border-2 border-purple-200 
                     focus:border-purple-400 focus:outline-none transition-all duration-300
                     bg-white cursor-pointer hover:border-purple-300 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B59B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
    </div>
  )
}

