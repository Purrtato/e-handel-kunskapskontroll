import { useCart } from '../context/CartContext'

function Cart() {
  // Hämtar varukorgens innehåll och funktionerna från Context
  const { cart, removeFromCart } = useCart()

  // Räknar ut totalsumman genom att summera pris * antal för varje rad
  // reduce "vandrar igenom" hela listan och bygger upp ett enda värde (summan)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Varukorg</h1>

      {cart.length === 0 ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {cart.map(item => (
              <li key={item.id} className="border p-3 rounded-lg flex justify-between items-center">
                <span>{item.name} x {item.quantity}</span>
                <div className="flex items-center gap-3">
                  <span>{item.price * item.quantity} kr</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:underline">
                    Ta bort
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-lg font-semibold mb-4">Totalt: {total} kr</p>

          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Gå till checkout
          </button>
        </>
      )}
    </div>
  )
}

export default Cart