import { useLocation, Link } from 'react-router-dom'

function OrderConfirmation() {
  // Hämtar ordern som skickades med från Checkout.jsx via navigate
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="p-4">
        <p>Ingen orderinformation hittades.</p>
        <Link to="/" className="text-teal-600 hover:underline">Tillbaka till produkter</Link>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Tack för din order! 🎉</h1>
      <p className="mb-4 text-gray-600">Ordernummer: #{order.id}</p>

      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li key={index} className="border p-3 rounded-lg flex justify-between">
            <span>{item.product_name} x {item.quantity}</span>
            <span>{item.price_at_purchase * item.quantity} kr</span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-semibold mb-4">Totalt: {order.total} kr</p>

      <Link to="/" className="text-teal-600 hover:underline">Tillbaka till produkter</Link>
    </div>
  )
}

export default OrderConfirmation