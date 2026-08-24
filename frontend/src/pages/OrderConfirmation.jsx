import { useLocation, Link } from 'react-router-dom'

function OrderConfirmation() {
  // Hämtar ordern som skickades med från Checkout.jsx via navigate
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Ingen orderinformation hittades.</p>
          <Link to="/" className="text-emerald-400 hover:underline">Tillbaka till produkter</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex items-start justify-center pt-16">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h1 className="text-2xl font-bold text-white mb-1">Tack för din order! 🎉</h1>
      <p className="text-slate-400 mb-5">Ordernummer: #{order.id}</p>

      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between gap-2 text-sm border-b border-slate-700 pb-2">
            <span className="text-slate-300 truncate">{item.product_name} x {item.quantity}</span>
            <span className="text-white whitespace-nowrap">{item.price_at_purchase * item.quantity} kr</span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-bold text-white mb-5">Totalt: {order.total} kr</p>

      <Link to="/" className="text-emerald-400 hover:underline">Tillbaka till produkter</Link>
    </div>
    </div>
  )
}

export default OrderConfirmation