import { useState, useEffect } from 'react'
import { API_URL } from '../config'

function AdminOrders() {
  // Listan med alla ordrar, hämtade från backend
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Ordrar</h1>
      <ul className="space-y-3">
        {orders.map(order => (
          <li key={order.id} className="border p-3 rounded-lg">
            <p className="font-semibold">Order #{order.id} - {order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
            <p className="text-sm mb-2">Status: {order.status}</p>

            {/* Listar varje beställd vara i ordern */}
            <ul className="text-sm text-gray-700 ml-4 mb-2 list-disc">
              {order.items.map((item, index) => (
                <li key={index}>{item.product_name} x {item.quantity} - {item.price_at_purchase * item.quantity} kr</li>
              ))}
            </ul>

            <p className="text-sm font-semibold">Totalt: {order.total} kr</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminOrders