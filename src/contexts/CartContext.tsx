'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
  custom_description?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, customDescription?: string) => void
  updateQuantity: (productId: string, customDescription: string | undefined, quantity: number) => void
  updateCustomDescription: (productId: string, oldDescription: string | undefined, newDescription: string) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children, userId }: { children: React.ReactNode, userId?: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const storageKey = userId ? `@atelie-cart-${userId}` : '@atelie-cart-guest'

  // Load from localStorage on mount and when userId changes
  useEffect(() => {
    let loadedItems: CartItem[] = []
    const savedCart = localStorage.getItem(storageKey)
    
    if (savedCart) {
      try {
        loadedItems = JSON.parse(savedCart)
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }

    // Merge guest cart if user just logged in
    if (userId) {
      const guestCartStr = localStorage.getItem('@atelie-cart-guest')
      if (guestCartStr) {
        try {
          const guestItems: CartItem[] = JSON.parse(guestCartStr)
          if (guestItems.length > 0) {
            // Merge logic: append new items or add quantity
            guestItems.forEach(guestItem => {
              const existingIdx = loadedItems.findIndex(i => i.product_id === guestItem.product_id && i.custom_description === guestItem.custom_description)
              if (existingIdx >= 0) {
                loadedItems[existingIdx].quantity += guestItem.quantity
              } else {
                loadedItems.push(guestItem)
              }
            })
          }
        } catch (e) {
          console.error('Failed to merge guest cart', e)
        }
        // Remove guest cart after merge
        localStorage.removeItem('@atelie-cart-guest')
      }
    }

    setCartItems(loadedItems)
    setIsInitialized(true)
  }, [storageKey, userId])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized, storageKey])

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      // Check if item with same product_id and custom_description exists
      const existingItemIndex = prev.findIndex(
        item => item.product_id === newItem.product_id && item.custom_description === newItem.custom_description
      )

      if (existingItemIndex >= 0) {
        const updated = [...prev]
        updated[existingItemIndex].quantity += newItem.quantity
        return updated
      }

      return [...prev, newItem]
    })
  }

  const removeFromCart = (productId: string, customDescription?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product_id === productId && item.custom_description === customDescription)
    ))
  }

  const updateQuantity = (productId: string, customDescription: string | undefined, quantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product_id === productId && item.custom_description === customDescription) {
        return { ...item, quantity: Math.max(1, quantity) }
      }
      return item
    }))
  }

  const updateCustomDescription = (productId: string, oldDescription: string | undefined, newDescription: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.product_id === productId && item.custom_description === oldDescription) {
        return { ...item, custom_description: newDescription }
      }
      return item
    }))
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCustomDescription,
      clearCart,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
