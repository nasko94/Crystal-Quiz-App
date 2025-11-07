'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, Check, Loader2 } from 'lucide-react'
import { Product, ProductVariant, QuizData } from '@/types/quiz'

interface OrderPopupProps {
  products: Product[]
  quizData: QuizData
  onClose: () => void
  onOrder: (orderData: any) => void
}

interface ProductSelection {
  product: Product
  selected: boolean
  quantity: number
  selectedVariantId?: string
}

export default function OrderPopup({ products, quizData, onClose, onOrder }: OrderPopupProps) {
  const [mounted, setMounted] = useState(false)
  const [selections, setSelections] = useState<ProductSelection[]>(
    products.map(product => ({
      product,
      selected: true,
      quantity: 1,
      selectedVariantId: product.variants && product.variants.length > 0 
        ? product.variants[0].id 
        : product.variantId,
    }))
  )
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: '',
    econt: '',
  })
  const [isOfficeSelectorOpen, setIsOfficeSelectorOpen] = useState(false)
  const [receiverCity, setReceiverCity] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [selectedOfficeData, setSelectedOfficeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Изпращаме event към Klaviyo за Quiz Checkout Started (само веднъж)
    const sendCheckoutStartedEvent = async () => {
      // Проверяваме дали вече е изпратен event-ът
      const checkoutStartedSent = sessionStorage.getItem('quizCheckoutStarted')
      if (checkoutStartedSent === 'true') {
        console.log('⏭️ Quiz Checkout Started event already sent, skipping')
        return
      }

      try {
        const selectedProducts = selections.filter(sel => sel.selected)
        
        const properties: any = {
          quiz_type: 'crystal_quiz',
        }
        
        // Добавяме данни за всеки избран продукт
        selectedProducts.forEach((selection, index) => {
          const productName = selection.product.title || selection.product.name || 'Продукт'
          const productUrl = selection.product.handle 
            ? `https://crystalenergy.shop/products/${selection.product.handle}`
            : ''
          
          properties[`product${index + 1}_name`] = productName
          properties[`product${index + 1}_url`] = productUrl
          properties[`product${index + 1}_quantity`] = selection.quantity
          properties[`product${index + 1}_price`] = selection.product.price
        })
        
        properties.total_products = selectedProducts.length
        properties.total_quantity = selectedProducts.reduce((sum, sel) => sum + sel.quantity, 0)

        const eventData = {
          metricName: 'Quiz Checkout Started',
          email: quizData.email,
          properties,
        }

        const eventResponse = await fetch('https://api.flow-fast.ai/crystal-klaviyo-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        })

        if (eventResponse.ok) {
          console.log('✅ Quiz Checkout Started event sent successfully')
          // Запазваме в session storage, че event-ът е изпратен
          sessionStorage.setItem('quizCheckoutStarted', 'true')
        } else {
          console.warn('⚠️ Failed to send Quiz Checkout Started event:', await eventResponse.text())
        }
      } catch (err) {
        console.error('Error sending Quiz Checkout Started event:', err)
      }
    }
    
    // Изпращаме event-а когато се монтира компонентът (само ако не е изпратен вече)
    sendCheckoutStartedEvent()
    
    return () => setMounted(false)
  }, [])

  // Listen for messages from the office selector iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message
      if (event.origin === 'https://agreeable-forest-09fdc1003.1.azurestaticapps.net') {
        const officeData = event.data

        // Log all office data to console
        console.log('=== Office Selection Data ===')
        console.log('Full officeData object:', officeData)
        console.log('Office data keys:', officeData ? Object.keys(officeData) : 'No data')
        if (officeData && officeData.office) {
          console.log('Office object:', officeData.office)
          console.log('Office object keys:', Object.keys(officeData.office))
          if (officeData.office.address) {
            console.log('Office address:', officeData.office.address)
          }
        }
        console.log('Raw event.data:', event.data)
        console.log('===========================')

        // Extract the office name and full data
        if (officeData && officeData.office && officeData.office.address) {
          const officeName = officeData.office.name
          const officeCity = officeData.office.address?.city?.name || ''
          
          // Store the full office data for later use
          setSelectedOfficeData(officeData.office)
          
          // Update the econt field with the selected office name and city field with the city
          setFormData(prev => ({ 
            ...prev, 
            econt: officeName,
            city: officeCity
          }))
          
          // Close the office selector popup
          setIsOfficeSelectorOpen(false)
        }
      }
    }

    if (isOfficeSelectorOpen) {
      window.addEventListener('message', handleMessage)
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [isOfficeSelectorOpen])

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

  const updateVariant = (index: number, variantId: string) => {
    setSelections(prev =>
      prev.map((sel, i) => (i === index ? { ...sel, selectedVariantId: variantId } : sel))
    )
  }

  const getProductPrice = (selection: ProductSelection): number => {
    if (selection.selectedVariantId && selection.product.variants) {
      const variant = selection.product.variants.find(v => v.id === selection.selectedVariantId)
      if (variant) return variant.price
    }
    return selection.product.price
  }

  const selectedProducts = selections.filter(sel => sel.selected)
  
  // Изчисляваме общия брой бройки от избраните продукти
  const totalQuantity = selectedProducts.reduce((sum, sel) => sum + sel.quantity, 0)
  const qualifiesForDiscount = totalQuantity >= 3 // Минимум 3 бройки за отстъпка и безплатна доставка

  // Изчисляваме цените
  const subtotal = selectedProducts.reduce(
    (sum, sel) => sum + getProductPrice(sel) * sel.quantity,
    0
  )
  const discount = qualifiesForDiscount ? subtotal * 0.1 : 0 // 10% отстъпка ако има минимум 3 бройки
  const shipping = qualifiesForDiscount ? 0 : 6 // Безплатна доставка ако има минимум 3 бройки
  const total = subtotal - discount + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Split fullName into firstName and lastName
    const nameParts = formData.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] // If no last name, use first name again
    
    // Prepare lineItems
    const lineItems = selectedProducts.map(sel => {
      const variantId = sel.selectedVariantId || sel.product.variantId || ''
      return {
        variantId: variantId.replace('gid://shopify/ProductVariant/', ''),
        quantity: sel.quantity,
      }
    })
    
    // Get city - first from office locator, then from form field
    const city = selectedOfficeData?.address?.city?.name || formData.city || ''
    
    // Prepare shipping address from selected office data
    const shippingAddress = selectedOfficeData ? {
      address1: selectedOfficeData.name, // Office name
      city: city,
      country: selectedOfficeData.address?.city?.country?.code2 || 'BG',
      zip: selectedOfficeData.address?.city?.postCode || '',
      phone: formData.phone,
      firstName: firstName,
      lastName: lastName,
    } : {
      address1: formData.econt, // Fallback to manual input
      city: city,
      country: 'BG',
      zip: '',
      phone: formData.phone,
      firstName: firstName,
      lastName: lastName,
    }
    
    // Prepare the order payload
    const orderPayload = {
      lineItems,
      customer: {
        email: quizData.email || '', // Use email from quiz data
        firstName: firstName,
        lastName: lastName,
        phone: formData.phone,
      },
      shippingAddress,
      discountPercentage: qualifiesForDiscount ? 10 : 0,
      note: qualifiesForDiscount ? 'Безплатна Доставка | AI Crystal Quiz' : 'AI Crystal Quiz',
      tags: qualifiesForDiscount ? ['COD', 'Безплатна Доставка', 'AI Crystal Quiz'] : ['COD', 'AI Crystal Quiz'],
      paymentPending: true, // COD order
    }
    
    console.log('=== Order Payload ===')
    console.log('Order payload:', orderPayload)
    console.log('====================')
    
    // Send order to API
    try {
      const response = await fetch('https://api.flow-fast.ai/crystal-create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })
      
      const result = await response.json()
      console.log('Order creation result:', result)
      
      if (result.success) {
        // Success - prepare data for OrderSummary component
        console.log('✅ Order created successfully!')
        
        // Adapt the data to OrderSummary format
        const orderSummaryData = {
          orderNumber: result.order?.name || result.order?.id || 'N/A',
          firstName: firstName,
          lastName: lastName,
          phone: formData.phone,
          city: city, // Use the same city logic (office locator first, then form field)
          econt: selectedOfficeData?.name || formData.econt,
          products: selectedProducts.map(sel => {
            // Get variant info if available
            let variantText = null
            if (sel.selectedVariantId && sel.product.variants) {
              const variant = sel.product.variants.find(v => v.id === sel.selectedVariantId)
              if (variant) {
                if (variant.selectedOptions && variant.selectedOptions.length > 0) {
                  variantText = variant.selectedOptions.map(opt => opt.value).join(' / ')
                } else if (variant.title && variant.title !== 'Default Title') {
                  variantText = variant.title
                }
              }
            }
            
            return {
              name: sel.product.title || sel.product.name || 'Продукт',
              variant: variantText,
              price: getProductPrice(sel) * sel.quantity,
              quantity: sel.quantity,
              image: getFirstImage(sel.product),
            }
          }),
          subtotal: subtotal,
          shipping: shipping,
          discount: discount,
          total: total,
        }
        
        // Изпращаме event за успешна покупка към Klaviyo
        const sendPurchaseEvent = async () => {
          try {
            const properties: any = {
              quiz_type: 'crystal_quiz',
              order_number: orderSummaryData.orderNumber,
              subtotal: subtotal,
              shipping: shipping,
              discount: discount,
              total: total,
            }
            
            // Добавяме данни за всеки закупен продукт
            selectedProducts.forEach((selection, index) => {
              const productName = selection.product.title || selection.product.name || 'Продукт'
              const productUrl = selection.product.handle 
                ? `https://crystalenergy.shop/products/${selection.product.handle}`
                : ''
              
              properties[`product${index + 1}_name`] = productName
              properties[`product${index + 1}_url`] = productUrl
              properties[`product${index + 1}_quantity`] = selection.quantity
              properties[`product${index + 1}_price`] = getProductPrice(selection) * selection.quantity
            })
            
            properties.total_products = selectedProducts.length
            properties.total_quantity = selectedProducts.reduce((sum, sel) => sum + sel.quantity, 0)

            const eventData = {
              metricName: 'Purchase',
              email: quizData.email,
              properties,
            }

            const eventResponse = await fetch('https://api.flow-fast.ai/crystal-klaviyo-event', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(eventData),
            })

            if (eventResponse.ok) {
              console.log('✅ Purchase event sent successfully')
            } else {
              console.warn('⚠️ Failed to send Purchase event:', await eventResponse.text())
            }
          } catch (err) {
            console.error('Error sending Purchase event:', err)
          }
        }
        
        // Изпращаме event-а (не чакаме резултата)
        sendPurchaseEvent()
        
        // Close popup and pass data to parent
        setIsLoading(false)
        onClose()
        onOrder(orderSummaryData)
      } else {
        // Error - show error message
        console.error('❌ Order creation failed:', result)
        setIsLoading(false)
        alert(`Грешка при създаване на поръчка: ${result.error || 'Неизвестна грешка'}`)
      }
    } catch (error) {
      console.error('❌ Error creating order:', error)
      setIsLoading(false)
      alert('Грешка при създаване на поръчка. Моля, опитайте отново.')
    }
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
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 pr-6 md:pr-8 pb-6 md:pb-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-[10000] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-purple-300 [&::-webkit-scrollbar]:mr-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#e9d5ff transparent' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
            Завърши поръчката
          </h2>

          {/* Products Section */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Продукти</h3>
            <div className="space-y-2 md:space-y-4">
              {selections.map((selection, index) => {
                const imageUrl = getFirstImage(selection.product)
                return (
                  <div
                    key={selection.product.id}
                    className="flex items-center gap-2 md:gap-4 p-2 md:p-4 border-2 border-purple-100 rounded-lg md:rounded-xl hover:border-purple-300 transition-colors"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelection(index)}
                      className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-all ${
                        selection.selected
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selection.selected && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                    </button>

                    {/* Product Image */}
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={selection.product.title || selection.product.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
                          <span className="text-lg md:text-2xl">💎</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-1">
                        {selection.product.title || selection.product.name || 'Продукт'}
                      </h4>
                      {/* Variant Selector */}
                      {selection.product.variants && selection.product.variants.length > 1 && (
                        <select
                          value={selection.selectedVariantId || ''}
                          onChange={(e) => updateVariant(index, e.target.value)}
                          className="w-full mt-1 mb-1 px-2 py-1 text-xs md:text-sm rounded-lg border border-purple-200 
                                   focus:border-purple-400 focus:outline-none transition-all duration-300
                                   bg-white cursor-pointer hover:border-purple-300 appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239B59B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '0.75rem',
                            paddingRight: '1.75rem',
                          }}
                        >
                          {selection.product.variants.map((variant) => {
                            // Използваме selectedOptions ако е налично, иначе title
                            const displayText = variant.selectedOptions && variant.selectedOptions.length > 0
                              ? variant.selectedOptions.map(opt => opt.value).join(' / ')
                              : variant.title
                            return (
                              <option key={variant.id} value={variant.id} disabled={variant.available === false}>
                                {displayText} {variant.available === false ? '(Недостъпен)' : ''}
                              </option>
                            )
                          })}
                        </select>
                      )}
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2 mt-0.5">
                        {selection.product.description}
                      </p>
                    </div>

                    {/* Quantity and Price - Stacked on mobile */}
                    <div className="flex flex-col items-end gap-1 md:gap-2 flex-shrink-0">
                      {/* Quantity */}
                      <div className="flex items-center gap-0.5 md:gap-2">
                        <button
                          onClick={() => updateQuantity(index, selection.quantity - 1)}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center justify-center font-bold text-sm md:text-base leading-none p-0"
                        >
                          <span className="flex items-center justify-center h-full w-full -translate-y-0.5">−</span>
                        </button>
                        <span className="w-6 md:w-12 text-center font-semibold text-sm md:text-base">{selection.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, selection.quantity + 1)}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center justify-center font-bold text-sm md:text-base leading-none p-0"
                        >
                          <span className="flex items-center justify-center h-full w-full -translate-y-0.5">+</span>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-sm md:text-lg text-gray-800">
                          {(getProductPrice(selection) * selection.quantity).toFixed(2)} лв
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 hidden md:block">
                          {getProductPrice(selection).toFixed(2)} лв/бр
                        </div>
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
                className="mt-3 md:mt-4 p-3 md:p-4 bg-green-50 border-2 border-green-200 rounded-lg md:rounded-xl text-center"
              >
                <p className="text-green-700 font-semibold text-sm md:text-base">
                  🎉 Поздравления! Получаваш 10% намаление и безплатна доставка!
                </p>
              </motion.div>
            ) : (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg md:rounded-xl text-center">
                <p className="text-yellow-700 text-xs md:text-sm">
                  💡 Добави още {3 - totalQuantity} бройки за да получиш 10% отстъпка и безплатна доставка!
                </p>
              </div>
            )}
          </div>

          {/* Prices Section */}
          <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-50 rounded-lg md:rounded-xl">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Цени</h3>
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
                  <span className="text-base font-semibold text-gray-800">Общо:</span>
                  <span className="text-lg font-semibold text-gradient">{total.toFixed(2)} лв</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">Данни за доставка</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име и Фамилия *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                  placeholder="Твоето име и фамилия"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Град *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                  placeholder="Твоят град"
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
                  Офис на Еконт или Личен Адрес*
                </label>
                <div className="flex gap-2 items-stretch min-w-0">
                  <input
                    type="text"
                    required
                    value={formData.econt}
                    onChange={(e) => setFormData({ ...formData, econt: e.target.value })}
                    className="flex-1 min-w-0 px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg"
                    placeholder="Личен Адрес"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Update receiverCity and receiverAddress from form data before opening
                      setReceiverCity(formData.city || '')
                      setReceiverAddress(formData.econt || '')
                      setIsOfficeSelectorOpen(true)
                    }}
                    className="px-3 md:px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all duration-300 font-semibold text-sm md:text-base shadow-md hover:shadow-lg flex-shrink-0 leading-tight"
                  >
                    <span className="block md:hidden">
                      Избери<br />Офис
                    </span>
                    <span className="hidden md:block whitespace-nowrap">
                      Избери Офис
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full bg-gradient-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Създаване на поръчка...</span>
                </>
              ) : (
                <span>Поръчай</span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  // Office Selector Popup
  const officeSelectorPopup = isOfficeSelectorOpen ? (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOfficeSelectorOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] h-[90%] bg-white rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOfficeSelectorOpen(false)}
            className="absolute top-4 right-4 z-[10002] px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Iframe */}
          <iframe
            src={`https://agreeable-forest-09fdc1003.1.azurestaticapps.net/?source=ee?officeType=&shopUrl=e-econt&city=${encodeURIComponent(receiverCity)}&address=${encodeURIComponent(receiverAddress)}&lang=bg`}
            className="w-full h-full border-0"
            style={{ border: 'none' }}
            title="Office Selector"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null

  return (
    <>
      {createPortal(popupContent, document.body)}
      {isOfficeSelectorOpen && createPortal(officeSelectorPopup, document.body)}
    </>
  )
}

