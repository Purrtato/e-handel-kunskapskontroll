import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { API_URL } from '../config'

function Checkout() {
  // Hämtar varukorgen och en funktion för att tömma den efter lyckad order
  const { cart, clearCart } = useCart()
  const navigate = useNavigate() // För att skicka kunden vidare efter köpet

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function handleSubmit(e) {
    e.preventDefault()

    // Gör om varukorgen till det format backend förväntar sig
    const items = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }))

    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: customerName,
        customer_email: customerEmail,
        items
      })
    })
      .then(res => res.json())
      .then(order => {
        clearCart() // Töm varukorgen efter lyckat köp
        navigate('/order-confirmation', { state: { order } }) // Skicka med ordern till nästa sida
      })
      .catch(err => console.error(err))
  }

  if (cart.length === 0) {
    return <p className="p-4">Din varukorg är tom.</p>
  }

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <p className="mb-4 font-semibold">Totalt: {total} kr</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder="Namn"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          value={customerEmail}
          onChange={e => setCustomerEmail(e.target.value)}
          placeholder="E-post"
          className="border p-2 rounded w-full"
          required
        />

        {/* Betalningsformulär, bara för utseendet */}
        <input
          type="text"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          placeholder="Kortnummer"
          className="border p-2 rounded w-full"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            placeholder="MM/ÅÅ"
            className="border p-2 rounded w-1/2"
            required
          />
          <input
            type="text"
            value={cvc}
            onChange={e => setCvc(e.target.value)}
            placeholder="CVC"
            className="border p-2 rounded w-1/2"
            required
          />
        </div>

        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full">
          Betala {total} kr
        </button>
      </form>
    </div>
  )
}

export default Checkout