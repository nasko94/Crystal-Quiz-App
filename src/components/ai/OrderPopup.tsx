'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, Check } from 'lucide-react'
import { Product } from '@/types/quiz'

interface OrderPopupProps {
  products: Product[]
  onClose: () => void
  onOrder: (orderData: any) => void
}

interface ProductSelection {
  product: Product
  selected: boolean
  quantity: number
}

export default function OrderPopup({ products, onClose, onOrder }: OrderPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [selections, setSelections] = useState<ProductSelection[]>(
    products.map(product => ({
      product,
      selected: true,
      quantity: 1,
    }))
  )
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    econt: '',
  })

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const toggleSelection = (index: number) => {
    setSelections(prev =>
      prev.map((sel, i) => (i === index ? { ...sel, selected: !sel.selected } : sel))
    )
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return
    setSelections(prev =>
      prev.map((sel, i) => (i === index ? { ...sel, quantity } : sel))
    )
  }

  const selectedProducts = selections.filter(sel => sel.selected)
  
  // Изчисляваме общия брой бройки от избраните продукти
  const totalQuantity = selectedProducts.reduce((sum, sel) => sum + sel.quantity, 0)
  const qualifiesForDiscount = totalQuantity >= 3 // Минимум 3 бройки за отстъпка и безплатна доставка

  // Изчисляваме цените
  const subtotal = selectedProducts.reduce(
    (sum, sel) => sum + sel.product.price * sel.quantity,
    0
  )
  const discount = qualifiesForDiscount ? subtotal * 0.1 : 0 // 10% отстъпка ако има минимум 3 бройки
  const shipping = qualifiesForDiscount ? 0 : 6 // Безплатна доставка ако има минимум 3 бройки
  const total = subtotal - discount + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      products: selectedProducts.map(sel => ({
        ...sel.product,
        quantity: sel.quantity,
      })),
      subtotal,
      shipping,
      discount,
      total,
    }
    onOrder(orderData)
  }

  const getFirstImage = (product: Product): string | null => {
    if (!product.images || product.images.length === 0) return null
    const firstImage = product.images[0]
    return typeof firstImage === 'string' ? firstImage : (firstImage as any)?.src || null
  }

  if (!mounted) return null

  const popupContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-[10000]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Завърши поръчката
          </h2>

          {/* Products Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Продукти</h3>
            <div className="space-y-4">
              {selections.map((selection, index) => {
                const imageUrl = getFirstImage(selection.product)
                return (
                  <div
                    key={selection.product.id}
                    className="flex items-center gap-4 p-4 border-2 border-purple-100 rounded-xl hover:border-purple-300 transition-colors"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelection(index)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        selection.selected
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selection.selected && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={selection.product.title || selection.product.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
                          <span className="text-2xl">💎</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {selection.product.title || selection.product.name || 'Продукт'}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {selection.product.description}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, selection.quantity - 1)}
                        className="w-8 h-8 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center justify-center font-bold"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold">{selection.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, selection.quantity + 1)}
                        className="w-8 h-8 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-800">
                        {(selection.product.price * selection.quantity).toFixed(2)} лв
                      </div>
                      <div className="text-sm text-gray-500">
                        {selection.product.price.toFixed(2)} лв/бр
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Discount Message */}
            {qualifiesForDiscount ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center"
              >
                <p className="text-green-700 font-semibold">
                  🎉 Поздравления! Получаваш 10% намаление и безплатна доставка!
                </p>
              </motion.div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-700 text-sm">
                  💡 Добави още {3 - totalQuantity} бройки за да получиш 10% отстъпка и безплатна доставка!
                </p>
              </div>
            )}
          </div>

          {/* Prices Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Цени</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Междинна сума:</span>
                <span className="font-semibold">{subtotal.toFixed(2)} лв</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Отстъпка (10%):</span>
                  <span className="font-semibold">-{discount.toFixed(2)} лв</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка:</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">Безплатна</span>
                  ) : (
                    `${shipping.toFixed(2)} лв`
                  )}
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-800">Общо:</span>
                  <span className="text-2xl font-bold text-purple-600">{total.toFixed(2)} лв</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Данни за доставка</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  placeholder="Твоето име"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Твоята фамилия"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефонен номер *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="0898765432"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Офис на Еконт *
                </label>
                <input
                  type="text"
                  required
                  value={formData.econt}
                  onChange={(e) => setFormData({ ...formData, econt: e.target.value })}
                  className="input-field"
                  placeholder="Офис Еконт Виница"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all mt-6"
            >
              Поръчай
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(popupContent, document.body)
}

