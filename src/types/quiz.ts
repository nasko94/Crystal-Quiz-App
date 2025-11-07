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

export interface ProductVariantOption {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  legacyId?: string
  title: string
  price: number
  compareAtPrice?: number
  available?: boolean
  sku?: string | null
  barcode?: string | null
  inventoryQuantity?: number
  selectedOptions?: ProductVariantOption[]
  // Legacy support
  option1?: string
  option2?: string
  option3?: string
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
  variants?: ProductVariant[]
  options?: string[] // e.g., ["Size", "Color"]
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
