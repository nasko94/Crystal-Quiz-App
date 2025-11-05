export interface QuizData {
  name: string
  dateOfBirth: string
  zodiacSign: string
  happinessLevel: number
  lastAchievement: string
  needs: string
  obstacles: string
}

export interface Product {
  id: string
  name: string
  image: string
  price: number
  description: string
}

export interface OrderData {
  firstName: string
  lastName: string
  phone: string
  econt: string
  products: Product[]
  subtotal: number
  shipping: number
  discount: number
  total: number
}

