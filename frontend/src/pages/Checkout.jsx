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
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <p className="text-slate-400">Din varukorg är tom.</p>
      </div>
    )
  }

    if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <p className="text-slate-400">Din varukorg är tom.</p>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8 min-w-0">

          {/* Vänster kolumn, formuläret */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Namn"
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                required
              />
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="E-post"
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                required
              />

              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                placeholder="Kortnummer"
                className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/ÅÅ"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-1/2 focus:border-emerald-400 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-1/2 focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-500 text-slate-900 font-semibold px-4 py-3 rounded-lg hover:bg-emerald-400 transition-colors w-full"
              >
                Betala {total} kr
              </button>
            </form>
          </div>

          {/* Höger kolumn, ordersammanfattning */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-fit min-w-0">
            <h2 className="text-lg font-semibold text-white mb-4">Din order</h2>
            <ul className="space-y-3 mb-4">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between gap-2 text-sm min-w-0">
                  <span className="text-slate-300 truncate min-w-0">{item.name} x {item.quantity}</span>
                  <span className="text-white whitespace-nowrap shrink-0">{item.price * item.quantity} kr</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span className="text-white font-semibold">Totalt</span>
              <span className="text-emerald-400 font-bold text-lg">{total} kr</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout