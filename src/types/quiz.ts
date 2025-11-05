export interface QuizData {
  name: string
  dateOfBirth: string
  zodiacSign: string
  happinessLevel: number
  lastAchievement: string
  needs: string
  obstacles: string
}

export interface ProductImage {
  id?: string
  src: string
  alt?: string
  width?: number
  height?: number
}

export interface Product {
  id: string
  legacyId?: string
  name?: string
  title?: string
  handle?: string
  image?: string
  images?: (string | ProductImage)[]
  price: number
  compareAtPrice?: number
  variantId?: string
  available?: boolean
  description: string
}

export interface AIRecommendationData {
  success: boolean
  suggestion: string
  productIds: string[]
  fullProductData: Product[]
  collectionHandle?: string
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
