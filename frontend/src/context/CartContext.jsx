import { createContext, useContext, useState } from 'react'

// Skapar innehållet som alla komponenter kan hämta varukorgen ur utan att den behöver skickas manuellt genom varje mellanliggande komponent
const CartContext = createContext()

// CartProvider håller själva datan och delar ut den till allt som ligger "inuti" den
export function CartProvider({ children }) {
  // En array med produkter som lagts till
  const [cart, setCart] = useState([])

  // Lägger till en produkt i varukorgen
  function addToCart(product) {
    setCart(prev => {
      // Kollar om produkten redan finns i korgen
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        // Finns den redan öka bara "quantity" med 1 på den raden
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      // Finns den inte lägg till den som ny rad med quantity: 1
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Tar bort en produkt helt från varukorgen
  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  // Tömmer hela varukorgen (körs efter ett lyckat köp i checkout)
  function clearCart() {
    setCart([])
  }

  // Delar ut cart, addToCart, removeFromCart och clearCart till alla children
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Genväg för att komma åt varukorgen från vilken komponent som helst
export function useCart() {
  return useContext(CartContext)
}